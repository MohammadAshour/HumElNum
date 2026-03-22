import dbConnect from '../../../lib/db';
import Recipe from '../../../models/Recipe';
import { NextResponse } from 'next/server';

// Get all recipes
export async function GET() {
  try {
    await dbConnect();
    const recipes = await Recipe.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: recipes });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Create a new recipe
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Server-side validation check
    if (!body.title || !body.cookTime) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const recipe = await Recipe.create(body);
    return NextResponse.json({ success: true, data: recipe }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// Delete a recipe
export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await Recipe.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
