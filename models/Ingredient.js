
import mongoose from 'mongoose';

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, enum: ['جرام', 'قطعة', 'مللي'], required: true },
  isAvailable: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Ingredient || mongoose.model('Ingredient', IngredientSchema);
