import dbConnect from '../../../lib/db';
import Ingredient from '../../../models/Ingredient';
import { NextResponse } from 'next/server';

/**
 * @description Get all ingredients
 * @route GET /api/ingredients
 */
export async function GET() {
  try {
    await dbConnect();
    const ingredients = await Ingredient.find({});
    return NextResponse.json({ success: true, data: ingredients });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

/**
 * @description Create a new ingredient with explicit number conversion
 * @route POST /api/ingredients
 */
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Explicitly convert quantity to Number before saving to MongoDB
    const processedData = {
      ...body,
      quantity: Number(body.quantity)
    };

    const ingredient = await Ingredient.create(processedData);
    return NextResponse.json({ success: true, data: ingredient }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

/**
 * @description Delete an ingredient by ID
 * @route DELETE /api/ingredients?id=XYZ
 */
export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await Ingredient.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
