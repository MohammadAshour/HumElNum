import dbConnect from '../../../lib/db';
import Recipe from '../../../models/Recipe';
import Ingredient from '../../../models/Ingredient';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  try {
    // 1. هات أسماء المكونات المتاحة فقط (isAvailable: true)
    const availableDocs = await Ingredient.find({ isAvailable: true }).select('name');
    const availableNames = availableDocs.map(ing => ing.name.trim());

    // 2. هات كل الوصفات
    const allRecipes = await Recipe.find({}).lean();

    // 3. فلترة الوصفات
    const possibleRecipes = allRecipes.filter(recipe => {
      // التأكد إن فيه مصفوفة مكونات
      if (!recipe.ingredients || !Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
        return false;
      }

      // المنطق: هل "كل" مكون في الوصفة موجود في قائمة "المتاح"؟
      const hasAllIngredients = recipe.ingredients.every(ingName => 
        availableNames.includes(ingName.trim())
      );

      // Debugging: اطبع في الـ Terminal عشان تشوف ليه الوصفة سقطت
      if (!hasAllIngredients) {
        console.log(`Recipe "${recipe.title}" is missing something.`);
        console.log(`Needs: ${recipe.ingredients}`);
        console.log(`Available: ${availableNames}`);
      }

      return hasAllIngredients;
    });

    return NextResponse.json({ success: true, data: possibleRecipes });
  } catch (error) {
    console.error("Suggestion Error:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
