// app/api/recipes/route.js
import dbConnect from '../../../lib/db';
import Recipe from '../../../models/Recipe';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    
    // التأكد من عدم وجود أكلة بنفس الاسم (مع تجاهل المسافات)
    const existingRecipe = await Recipe.findOne({ 
      title: { $regex: new RegExp(`^${body.title.trim()}$`, 'i') } 
    });

    if (existingRecipe) {
      return NextResponse.json({ success: false, error: "الأكلة دي موجودة فعلاً في كتاب الوصفات!" }, { status: 400 });
    }

    const recipe = await Recipe.create(body);
    return NextResponse.json({ success: true, data: recipe });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
