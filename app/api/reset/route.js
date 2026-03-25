import dbConnect from '../../../../lib/db';
import Recipe from '../../../../models/Recipe';
import { NextResponse } from 'next/server';

export async function POST() {
  await dbConnect();
  try {
    // تحديث جميع السجلات بوضع قيمة null في حقل lastEaten
    await Recipe.updateMany({}, { lastEaten: null });
    
    return NextResponse.json({ success: true, message: "تمت إعادة تعيين التواريخ بنجاح" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
