import dbConnect from '../../../lib/db';
import Ingredient from '../../../models/Ingredient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const ingredients = await Ingredient.find({});
    return NextResponse.json({ success: true, data: ingredients });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

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
