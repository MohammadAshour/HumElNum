'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    type: 'غداء',
    cookTime: '',
    difficulty: 'سهل',
    instructions: ''
  });

  const fetchRecipes = async () => {
    const res = await fetch('/api/recipes');
    const json = await res.json();
    if (json.success) setRecipes(json.data);
  };

  useEffect(() => { fetchRecipes(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecipe),
    });
    setNewRecipe({ title: '', type: 'غداء', cookTime: '', difficulty: 'سهل', instructions: '' });
    fetchRecipes();
  };

  const deleteRecipe = async (id) => {
    if(confirm("حذف الوصفة؟")) {
      await fetch(`/api/recipes?id=${id}`, { method: 'DELETE' });
      fetchRecipes();
    }
  };

  return (
    <div dir="rtl" style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center' }}>لوحة تحكم الوصفات 👨‍🍳</h1>
      
      {/* فورم إضافة وصفة */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', maxWidth: '600px', margin: '0 auto 30px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input placeholder="اسم الأكلة" value={newRecipe.title} onChange={e => setNewRecipe({...newRecipe, title: e.target.value})} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
          
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

          <input placeholder="مدة الطبخ (بالدقائق)" type="number" value={newRecipe.cookTime} onChange={e => setNewRecipe({...newRecipe, cookTime: e.target.value})} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
          
          <textarea placeholder="خطوات التحضير..." value={newRecipe.instructions} onChange={e => setNewRecipe({...newRecipe, instructions: e.target.value})} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px' }} />
          
          <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>حفظ الوصفة</button>
        </form>
      </div>

      {/* عرض الوصفات المضافة */}
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3>الوصفات المسجلة ({recipes.length})</h3>
        {recipes.map(recipe => (
          <div key={recipe._id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <strong>{recipe.title}</strong> ({recipe.type})
              <div style={{ fontSize: '12px', color: '#666' }}>🕒 {recipe.cookTime} دقيقة | 📊 {recipe.difficulty}</div>
            </div>
            <button onClick={() => deleteRecipe(recipe._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>حذف</button>
          </div>
        ))}
      </div>
    </div>
  );
}
