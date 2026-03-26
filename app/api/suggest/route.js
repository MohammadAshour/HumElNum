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
    const action = searchParams.get('action');

    if (!type) return NextResponse.json({ success: false, error: "اختار النوع" });

    // 1. تسجيل الأكلة الحالية كأنها اتاكلت "أمس"
    if (action === 'markEaten' && excludeId) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      await Recipe.findByIdAndUpdate(excludeId, { lastEaten: yesterday });
    }

    // 2. تحديد تاريخ "المنع" (أقل من 48 ساعة من دلوقتي)
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

    // 3. بناء الفلتر الذكي
    let matchQuery = { 
      type: type,
      $or: [
        { lastEaten: { $lt: fortyEightHoursAgo } }, // أكلات اتاكلت من أكتر من 48 ساعة
        { lastEaten: null }                          // أو أكلات لسه ماكلناهاش خالص
      ]
    };

    // 4. استبعاد الأكلة المعروضة حالياً (عشان زرار "شوف غيره")
    if (excludeId && mongoose.Types.ObjectId.isValid(excludeId)) {
      matchQuery._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
    }

    // 5. السحب العشوائي
    const recipes = await Recipe.aggregate([
      { $match: matchQuery },
      { $sample: { size: 1 } }
    ]);

    // 6. لو مفيش نتائج (كل الأكلات اتاكلت قريب)، نلغي فلتر الـ 48 ساعة ونجيب أي حاجة
    if (recipes.length === 0) {
      const fallbackRecipes = await Recipe.aggregate([
        { $match: { type: type, _id: { $ne: new mongoose.Types.ObjectId(excludeId) } } },
        { $sample: { size: 1 } }
      ]);
      
      return NextResponse.json({ 
        success: true, 
        data: fallbackRecipes.length > 0 ? fallbackRecipes[0] : null,
        message: "تم عرض أكلات قديمة لعدم وجود بدائل جديدة" 
      });
    }

    return NextResponse.json({ success: true, data: recipes[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
