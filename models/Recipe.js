import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['فطار', 'غداء', 'عشاء'], required: true },
  cookTime: { type: Number, required: true },
  difficulty: { type: String, enum: ['سهل', 'وسط', 'صعب'], required: true },
  
  // التعديل الجوهري هنا: خليه مصفوفة من النصوص فقط
  ingredients: [String], 
  
  instructions: { type: String, required: true },
  lastEaten: { type: Date, default: null }
});

export default mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);
