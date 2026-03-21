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
    // Fetch all items and sort by newest first
    const ingredients = await Ingredient.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: ingredients });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

/**
 * @description Add a new ingredient
 * @route POST /api/ingredients
 */
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Explicitly convert quantity to Number to match Schema
    const payload = {
      name: body.name,
      quantity: Number(body.quantity),
      unit: body.unit
    };

    const ingredient = await Ingredient.create(payload);
    return NextResponse.json({ success: true, data: ingredient }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

/**
 * @description Update ingredient quantity (+ or -)
 * @route PUT /api/ingredients?id=ID_HERE
 */
export async function PUT(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    // Update only the quantity field
    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      id,
      { $set: { quantity: Number(body.quantity) } },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: updatedIngredient });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

/**
 * @description Delete an ingredient
 * @route DELETE /api/ingredients?id=ID_HERE
 */
export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return
