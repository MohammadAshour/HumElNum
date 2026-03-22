'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ChefPage() {
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
      // جلب الوصفات
      const resRecipes = await fetch('/api/recipes');
      const jsonRecipes = await resRecipes.json();
      if (jsonRecipes.success) setRecipes(jsonRecipes.data);

      // جلب مكونات المخزن للاختيار منها
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
    
    if (selectedIngredients.length === 0) {
      alert("يا شيف، لازم تختار مكونات للأكلة دي!");
      return;
    }

    const recipeData = { 
      ...newRecipe, 
      cookTime: Number(newRecipe.cookTime),
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
        alert("✅ تسلم إيدك يا شيف.. الأكلة اتضافت!");
        setNewRecipe({ title: '', type: 'غداء', cookTime: '', difficulty: 'سهل', instructions: '' });
        setSelectedIngredients([]);
        fetchData();
      } else {
        alert("❌ فيه مشكلة في الحفظ: " + result.error);
      }
    } catch (err) {
      alert("⚠️ السيرفر مش واصل: " + err.message);
    }
  };

  const deleteRecipe = async (id) => {
    if(confirm("هنحذف الأكلة دي من كتاب الوصفات؟")) {
      await fetch(`/api/recipes?id=${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  return (
    <div dir="rtl" style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* زرار العودة */}
        <Link href="/" style={{ textDecoration: 'none', color: '#6366f1', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px' }}>
          <span>⬅️</span> العودة للمنيو الرئيسي
        </Link>

        <h1 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '30px' }}>👨‍Chef مطبخ الشيف</h1>
        
        {/* فورم إضافة الأكلة */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#475569' }}>إضافة وصفة جديدة لكتاب الطبخ</h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              placeholder="اسم الأكلة (مثلاً: كفتة داوود باشا)" 
              value={newRecipe.title} 
              onChange={e => setNewRecipe({...newRecipe, title: e.target.value})} 
              required 
              style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e0', fontSize: '1rem' }} 
            />
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <select value={newRecipe.type} onChange={e => setNewRecipe({...newRecipe, type: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e0' }}>
                <option value="فطار">فطار</option>
                <option value="غداء">غداء</option>
                <option value="عشاء">عشاء</option>
              </select>
              <select value={newRecipe.difficulty} onChange={e => setNewRecipe({...newRecipe, difficulty: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e0' }}>
                <option value="سهل">سهل</option>
                <option value="وسط">وسط</option>
                <option value="صعب">صعب</option>
              </select>
            </div>

            <input 
              placeholder="وقت التحضير (بالدقائق)" 
              type="number" 
              value={newRecipe.cookTime} 
              onChange={e => setNewRecipe({...newRecipe, cookTime: e.target.value})} 
              required 
              style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e0' }} 
            />

            {/* اختيار المكونات من المخزن */}
            <div style={{ border: '1px solid #e2e8f0', padding: '15px', borderRadius: '10px', backgroundColor: '#f8fafc' }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '0.9rem' }}>اختر مكونات الأكلة (من المخزن):</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {allIngredients.map(ing => (
                  <button
                    key={ing._id}
                    type="button"
                    onClick={() => handleIngredientToggle(ing.name)}
                    style={{
                      padding: '8px 12px', borderRadius: '20px', border: '1px solid #cbd5e0', cursor: 'pointer', fontSize: '0.85rem',
                      backgroundColor: selectedIngredients.includes(ing.name) ? '#6366f1' : '#fff',
                      color: selectedIngredients.includes(ing.name) ? '#fff' : '#475569',
                      transition: '0.2s'
                    }}
                  >
                    {ing.name}
                  </button>
                ))}
              </div>
              {allIngredients.length === 0 && <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>لازم تضيف مكونات في "المخزن" الأول عشان تظهر هنا.</p>}
            </div>
            
            <textarea 
              placeholder="اكتب طريقة التحضير هنا..." 
              value={newRecipe.instructions} 
              onChange={e => setNewRecipe({...newRecipe, instructions: e.target.value})} 
              required 
              style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e0', minHeight: '120px', fontSize: '1rem' }} 
            />
            
            <button type="submit" style={{ backgroundColor: '#6366f1', color: 'white', padding: '15px', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
              حفظ في كتاب الوصفات 📖
            </button>
          </form>
        </div>

        {/* قائمة الأكلات الحالية */}
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '15px', color: '#334155' }}>وصفاتك الحالية ({recipes.length})</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {recipes.map(recipe => (
              <div key={recipe._id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRight: '6px solid #6366f1' }}>
                <div>
                  <strong style={{ fontSize: '1.1rem' }}>{recipe.title}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    🕒 {recipe.cookTime} دقيقة | {recipe.type} | {recipe.ingredients?.length || 0} مكونات
                  </div>
                </div>
                <button onClick={() => deleteRecipe(recipe._id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>حذف</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
