import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // التعديل: مصفوفة نصوص للسماح بأكثر من نوع (فطار، غداء، عشاء)
  type: [{ type: String, enum: ['فطار', 'غداء', 'عشاء'] }], 
  cookTime: { type: Number, required: true },
  difficulty: { type: String, enum: ['سهل', 'وسط', 'صعب'], default: 'سهل' },
  ingredients: [String],
  instructions: { type: String, required: true },
  lastEaten: { type: Date, default: null }
}, { timestamps: true });


export default mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);
