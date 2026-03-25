import dbConnect from '../../../../lib/db';
import Recipe from '../../../../models/Recipe';
import { NextResponse } from 'next/server';

// إجبار Next.js على التعامل مع الـ API ده كـ Dynamic 
// عشان ميبوظش الـ Build وهو بيحاول يعمل Static Generation
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await dbConnect();
    
    // تحديث كل الأكلات ومسح تاريخ آخر مرة أكلنا فيها
    const result = await Recipe.updateMany(
      {}, 
      { $set: { lastEaten: null } }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: "تمت إعادة تعيين التواريخ بنجاح",
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error("Reset API Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
