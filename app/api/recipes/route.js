import dbConnect from '../../../lib/db';
import Recipe from '../../../models/Recipe';
import { NextResponse } from 'next/server';

// جلب كل الوصفات
export async function GET() {
  await dbConnect();
  try {
    const recipes = await Recipe.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: recipes });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

// إضافة وصفة جديدة
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const recipe = await Recipe.create(body);
    return NextResponse.json({ success: true, data: recipe }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// حذف وصفة
export async function DELETE(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  try {
    await Recipe.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
