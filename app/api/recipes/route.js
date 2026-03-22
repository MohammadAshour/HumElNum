import dbConnect from '../../../lib/db';
import Recipe from '../../../models/Recipe';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  try {
    const recipes = await Recipe.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: recipes });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const cleanTitle = body.title.trim();

    // التأكد إن الأكلة مش موجودة قبل كدة (تجاهل حالة الأحرف والمسافات)
    const existing = await Recipe.findOne({ 
      title: { $regex: new RegExp(`^${cleanTitle}$`, 'i') } 
    });

    if (existing) {
      return NextResponse.json({ 
        success: false, 
        error: "الأكلة دي موجودة فعلاً في كتاب الوصفات!" 
      }, { status: 400 });
    }

    const recipe = await Recipe.create({ ...body, title: cleanTitle });
    return NextResponse.json({ success: true, data: recipe });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await Recipe.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
