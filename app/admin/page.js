'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [recipes, setRecipes] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]); // Master list from DB
  const [selectedIngredients, setSelectedIngredients] = useState([]); // Ingredients for current recipe
  
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    type: 'غداء',
    cookTime: '',
    difficulty: 'سهل',
    instructions: ''
  });

  const fetchData = async () => {
    // Fetch Recipes
    const resRecipes = await fetch('/api/recipes');
    const jsonRecipes = await resRecipes.json();
    if (jsonRecipes.success) setRecipes(jsonRecipes.data);

    // Fetch Master Ingredients
    const resIng = await fetch('/api/ingredients');
    const jsonIng = await resIng.json();
    if (jsonIng.success) setAllIngredients(jsonIng.data);
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
    const recipeData = { ...newRecipe, ingredients: selectedIngredients };
    
    await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipeData),
    });

    setNewRecipe({ title: '', type: 'غداء', cookTime: '', difficulty: 'سهل', instructions: '' });
    setSelectedIngredients([]);
    fetchData();
  };

  const deleteRecipe = async (id) => {
    if(confirm("حذف الوصفة؟")) {
      await fetch(`/api/recipes?id=${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  return (
    <div dir="rtl" style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#1e293b' }}>إدارة مطبخ هم النم 👨‍🍳</h1>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', maxWidth: '700px', margin: '0 auto 30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>إضافة وصفة جديدة</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <input placeholder="اسم الأكلة (مثلاً: مكرونة بالبشاميل)" value={newRecipe.title} onChange={e => setNewRecipe({...newRecipe, title: e.target.value})} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
          
          <div style={{ display: 'flex', gap: '10px' }}>
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

          <input placeholder="مدة الطبخ (بالدقائق)" type="number" value={newRecipe.cookTime} onChange={e => setNewRecipe({...newRecipe, cookTime: e.target.value})} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />

          {/* اختيار المكونات المطلوبة لهذه الوصفة */}
          <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>المكونات المطلوبة لهذه الأكلة:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {allIngredients.map(ing => (
                <button
                  key={ing._id}
                  type="button"
                  onClick={() => handleIngredientToggle(ing.name)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '20px',
                    border: '1px solid #ddd',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    backgroundColor: selectedIngredients.includes(ing.name) ? '#3b82f6' : '#fff',
                    color: selectedIngredients.includes(ing.name) ? '#fff' : '#333',
                    transition: '0.2s'
                  }}
                >
                  {ing.name}
                </button>
              ))}
            </div>
          </div>
          
          <textarea placeholder="طريقة التحضير (خطوة بخطوة)..." value={newRecipe.instructions} onChange={e => setNewRecipe({...newRecipe, instructions: e.target.value})} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '120px' }} />
          
          <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', padding: '15px', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>حفظ الوصفة في الكتاب</button>
        </form>
      </div>

      {/* قائمة الوصفات الحالية */}
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h3 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>وصفاتنا الحالية ({recipes.length})</h3>
        <div style={{ display: 'grid', gap: '15px', marginTop: '15px' }}>
          {recipes.map(recipe => (
            <div key={recipe._id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div>
                <strong style={{ fontSize: '1.1rem' }}>{recipe.title}</strong> 
                <span style={{ marginRight: '10px', color: '#64748b', fontSize: '0.9rem' }}>({recipe.type})</span>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '5px' }}>
                  🕒 {recipe.cookTime} دقيقة | 📊 {recipe.difficulty} | 🥗 {recipe.ingredients?.length || 0} مكونات
                </div>
              </div>
              <button onClick={() => deleteRecipe(recipe._id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>حذف</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
