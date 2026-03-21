import mongoose from 'mongoose';

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 0 }, // Ensure it's Number
  unit: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Ingredient || mongoose.model('Ingredient', IngredientSchema);
