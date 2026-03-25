import dbConnect from '../../../lib/db';
import Recipe from '../../../models/Recipe';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const excludeId = searchParams.get('exclude'); // ID الأكلة اللي عايزين نستبعدها

    if (!type) return NextResponse.json({ success: false, error: "اختار النوع" });

    // بناء فلتر الاستبعاد
    let matchQuery = { type: type };
    if (excludeId && mongoose.Types.ObjectId.isValid(excludeId)) {
      matchQuery._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
    }

    const recipes = await Recipe.aggregate([
      { $match: matchQuery },
      { $sample: { size: 1 } }
    ]);

    return NextResponse.json({ 
      success: true, 
      data: recipes.length > 0 ? recipes[0] : null 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}