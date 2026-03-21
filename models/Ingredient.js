import mongoose from 'mongoose';

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  unit: String,
});

export default mongoose.models.Ingredient || mongoose.model('Ingredient', IngredientSchema);
