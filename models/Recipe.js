import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['فطار', 'غداء', 'عشاء'], required: true },
  cookTime: { type: Number, required: true }, // المدة بالدقائق
  difficulty: { type: String, enum: ['سهل', 'وسط', 'صعب'], required: true },
  ingredients: [{ 
    name: String, 
    quantity: Number, 
    unit: String 
  }],
  instructions: { type: String, required: true },
  lastEaten: { type: Date, default: null } // عشان نتبع قاعدة الـ 7 أيام
}, { timestamps: true });

export default mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);
