import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // التعديل: مصفوفة نصوص للسماح بأكثر من نوع (فطار، غداء، عشاء)
  type: [{ type: String, enum: ['فطار', 'غداء', 'عشاء'] }], 
  cookTime: { type: Number, required: true },
  difficulty: { type: String, enum: ['سهل', 'وسط', 'صعب'], default: 'سهل' },
ingredients: [
  {
    name: { type: String, required: true },
    value: { type: Number, default: 0 }, // الرقم: 1, 2, 500
    unit: { type: String, default: 'واحدة' } // الوحدة: جرام، مل، كوب...
  }
],
  instructions: { type: String, required: true },
  lastEaten: { type: Date, default: null }
}, { timestamps: true });


export default mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);
