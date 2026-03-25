import dbConnect from '../../../lib/db';
import Recipe from '../../../models/Recipe';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const excludeId = searchParams.get('exclude');
    const action = searchParams.get('action'); // 'markEaten' أو null

    if (!type) return NextResponse.json({ success: false, error: "اختار النوع" });

    // 1. لو الأكشن "سجل إننا أكلناها"، نحدث التاريخ الأول
    if (action === 'markEaten' && excludeId) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      await Recipe.findByIdAndUpdate(excludeId, { lastEaten: yesterday });
    }

    // 2. بناء فلتر الاستبعاد للأكلة الحالية (أو اللي لسه واكلينها)
    let matchQuery = { type: type };
    if (excludeId && mongoose.Types.ObjectId.isValid(excludeId)) {
      matchQuery._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
    }

    // 3. سحب اقتراح جديد عشوائي
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
