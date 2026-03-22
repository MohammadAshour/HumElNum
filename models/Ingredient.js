import mongoose from 'mongoose';

const IngredientSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  
  isAvailable: { 
    type: Boolean, 
    default: false 
  }
});

// Export the model, check if it already exists to avoid recompilation errors in Next.js
export default mongoose.models.Ingredient || mongoose.model('Ingredient', IngredientSchema);
