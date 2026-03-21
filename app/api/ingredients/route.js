import dbConnect from '../../../lib/db';
import Ingredient from '../../../models/Ingredient';
import { NextResponse } from 'next/server';

/**
 * @description Get all ingredients from the database
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
 * @description Create a new ingredient
 * @route POST /api/ingredients
 */
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json(); // Parse the incoming JSON body
    const ingredient = await Ingredient.create(body); // Save to MongoDB
    return NextResponse.json({ success: true, data: ingredient }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
