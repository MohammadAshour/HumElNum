'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [recipes, setRecipes] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    type: 'غداء',
    cookTime: '',
    difficulty: 'سهل',
    instructions: ''
  });

  const fetchData = async () => {
    try {
      const resRecipes = await fetch('/api/recipes');
      const jsonRecipes = await resRecipes.json();
      if (jsonRecipes.success) setRecipes(jsonRecipes.data);

      const resIng = await fetch('/api/ingredients');
      const jsonIng = await resIng.json();
      if (jsonIng.success) setAllIngredients(jsonIng.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleIngredientToggle = (name) => {
    if (selectedIngredients.includes(name)) {
      setSelectedIngredients(selectedIngredients.filter(i => i !== name));
    } else {
      setSelectedIngredients([...selectedIngredients, name]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const recipeData = { 
      ...newRecipe, 
      cookTime: Number(newRecipe.cookTime), // Essential: Convert string to Number
      ingredients: selectedIngredients 
    };
    
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData),
      });

      const result = await res.json();
      if (result.success) {
        alert("✅ تم حفظ الوصفة بنجاح!");
        setNewRecipe({ title: '', type: 'غداء', cookTime: '', difficulty: 'سهل', instructions: '' });
        setSelectedIngredients([]);
        fetchData();
      } else {
        alert("❌ فشل في الحفظ: " + result.error);
      }
    } catch (err) {
      alert("⚠️ خطأ في الاتصال بالسيرفر: " + err.message);
    }
  };

  const deleteRecipe = async (id) => {
    if(confirm("هل أنت متأكد من حذف هذه الوصفة؟")) {
      await fetch(`/api/recipes?id=${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  return (
    <div dir="rtl" style={{ padding: '15px', fontFamily: 'Arial', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#2d3748' }}>لوحة التحكم 👨‍🍳</h1>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', maxWidth: '600px', margin: '0 auto 25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input placeholder="اسم الأكلة" value={newRecipe.title} onChange={e => setNewRecipe({...newRecipe, title: e.target.value})} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0' }} />
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <select value={newRecipe.type} onChange={e => setNewRecipe({...newRecipe, type: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '8px' }}>
              <option value="فطار">فطار</option>
              <option value="غداء">غداء</option>
              <option value="عشاء">عشاء</option>
            </select>
            <select value={newRecipe.difficulty} onChange={e => setNewRecipe({...newRecipe, difficulty: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '8px' }}>
              <option value="سهل">سهل</option>
              <option value="وسط">وسط</option>
              <option value="صعب">صعب</option>
            </select>
          </div>

          <input placeholder="مدة الطبخ (بالدقائق)" type="number" value={newRecipe.cookTime} onChange={e => setNewRecipe({...newRecipe, cookTime: e.target.value})} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0' }} />

          <div style={{ border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.9rem', marginBottom: '8px', fontWeight: 'bold' }}>اختر المكونات:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {allIngredients.map(ing => (
                <button
                  key={ing._id}
                  type="button"
                  onClick={() => handleIngredientToggle(ing.name)}
                  style={{
                    padding: '6px 10px', borderRadius: '15px', border: '1px solid #cbd5e0', fontSize: '0.8rem', cursor: 'pointer',
                    backgroundColor: selectedIngredients.includes(ing.name) ? '#4299e1' : '#edf2f7',
                    color: selectedIngredients.includes(ing.name) ? 'white' : '#4a5568'
                  }}
                >
                  {ing.name}
                </button>
              ))}
            </div>
          </div>
          
          <textarea placeholder="طريقة التحضير..." value={newRecipe.instructions} onChange={e => setNewRecipe({...newRecipe, instructions: e.target.value})} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', minHeight: '100px' }} />
          
          <button type="submit" style={{ backgroundColor: '#3182ce', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem' }}>حفظ الوصفة</button>
        </form>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ marginBottom: '15px' }}>الوصفات المسجلة ({recipes.length})</h3>
        {recipes.map(recipe => (
          <div key={recipe._id} style={{ backgroundColor: 'white', padding: '12px', borderRadius: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRight: '5px solid #3182ce' }}>
            <div>
              <strong>{recipe.title}</strong> <small>({recipe.type})</small>
              <div style={{ fontSize: '0.75rem', color: '#718096' }}>🕒 {recipe.cookTime} دقيقة | {recipe.ingredients?.length || 0} مكونات</div>
            </div>
            <button onClick={() => deleteRecipe(recipe._id)} style={{ color: '#e53e3e', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>حذف</button>
          </div>
        ))}
      </div>
    </div>
  );
}
