// اضف هذه الدالة في نهاية الملف
export async function PUT(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    // نحدث فقط الحقول المرسلة (مثل quantity)
    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      id,
      { $set: { quantity: Number(body.quantity) } },
      { new: true } // يرجع العنصر بعد التعديل
    );

    return NextResponse.json({ success: true, data: updatedIngredient });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
