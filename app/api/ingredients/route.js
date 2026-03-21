import dbConnect from '../../../lib/db';
import Ingredient from '../../../models/Ingredient';
import { NextResponse } from 'next/server';

// GET all ingredients
export async function GET() {
  try {
    await dbConnect();
    const ingredients = await Ingredient.find({});
    return NextResponse.json({ success: true, data: ingredients });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// POST a new ingredient
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const ingredient = await Ingredient.create(body);
    return NextResponse.json({ success: true, data: ingredient }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE an ingredient (New Functionality)
export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // Get the ID from the URL query
    await Ingredient.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
