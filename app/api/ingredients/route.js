import dbConnect from '../../../lib/db';
import Ingredient from '../../../models/Ingredient';
import { NextResponse } from 'next/server';

// Get all ingredients for the checklist
export async function GET() {
  await dbConnect();
  const ingredients = await Ingredient.find({}).sort({ name: 1 }); // Sort alphabetically
  return NextResponse.json({ success: true, data: ingredients });
}

// Add a new master ingredient
export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const ingredient = await Ingredient.create({ name: body.name });
  return NextResponse.json({ success: true, data: ingredient });
}

// Toggle availability status
export async function PUT(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  // Find the ingredient first to flip its status
  const item = await Ingredient.findById(id);
  if (!item) return NextResponse.json({ success: false, message: "Not found" });

  const updated = await Ingredient.findByIdAndUpdate(
    id, 
    { isAvailable: !item.isAvailable }, // Flip the boolean
    { new: true }
  );
  return NextResponse.json({ success: true, data: updated });
}

// Delete an ingredient from master list
export async function DELETE(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  await Ingredient.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
