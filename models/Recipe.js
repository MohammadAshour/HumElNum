// models/Recipe.js
const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // التعديل هنا: مصفوفة بدل نص واحد
  type: [{ type: String, enum: ['فطار', 'غداء', 'عشاء'] }], 
  cookTime: { type: Number, required: true },
  difficulty: { type: String, enum: ['سهل', 'وسط', 'صعب'] },
  ingredients: [String],
  instructions: { type: String, required: true },
  lastEaten: { type: Date, default: null }
});
