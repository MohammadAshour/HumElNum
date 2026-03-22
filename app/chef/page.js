'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ChefPage() {
  const [recipes, setRecipes] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({ title: '', cookTime: '', difficulty: 'سهل', instructions: '' });
  const [showAddIng, setShowAddIng] = useState(false);
  const [quickIngName, setQuickIngName] = useState('');

  const fetchData = async () => {
    const resR = await fetch('/api/recipes'); const jsonR = await resR.json();
    if (jsonR.success) setRecipes(jsonR.data);
    const resI = await fetch('/api/ingredients'); const jsonI = await resI.json();
    if (jsonI.success) setAllIngredients(jsonI.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleQuickAddIng = async () => {
    if (!quickIngName.trim()) return;
    const res = await fetch('/api/ingredients', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: quickIngName.trim() }),
    });
    if ((await res.json()).success) {
      setQuickIngName(''); setShowAddIng(false); fetchData();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedTypes.length === 0) return alert("اختار نوع الوجبة أولاً");
    
    const res = await fetch('/api/recipes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newRecipe, type: selectedTypes, ingredients: selectedIngredients, cookTime: Number(newRecipe.cookTime) }),
    });

    const result = await res.json();
    if (result.success) {
      alert("تمت إضافة الوصفة بنجاح!");
      setNewRecipe({ title: '', cookTime: '', difficulty: 'سهل', instructions: '' });
      setSelectedIngredients([]); setSelectedTypes([]); fetchData();
    } else {
      alert(result.error);
    }
  };

  const deleteRecipe = async (id) => {
    if(confirm("حذف الأكلة دي؟")) {
      await fetch(`/api/recipes?id=${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  return (
    <div dir="rtl" style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '700px', margin: '0 auto 20px auto' }}>
        <Link href="/" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 'bold' }}>🏠 الرئيسية</Link>
        <Link href="/store" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 'bold' }}>📦 المخزن</Link>
      </div>

      <h1 style={{ textAlign: 'center', color: '#1e293b' }}>👨‍🍳 مطبخ الشيف</h1>
      
      {/* فورم الإضافة */}
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '25px', maxWidth: '600px', margin: '0 auto', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input placeholder="اسم الأكلة" value={newRecipe.title} onChange={e => setNewRecipe({...newRecipe, title: e.target.value})} required style={{ padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {['فطار', 'غداء', 'عشاء'].map(t => (
            <button key={t} type="button" onClick={() => setSelectedTypes(prev => prev.includes(t) ? prev.filter(i => i !== t) : [...prev, t])}
              style={{ flex: 1, padding: '10px', borderRadius: '12px', cursor: 'pointer', border: '1px solid #e2e8f0',
                backgroundColor: selectedTypes.includes(t) ? '#6366f1' : '#fff', color: selectedTypes.includes(t) ? '#fff' : '#64748b'
              }}>{t}</button>
          ))}
        </div>

        <input placeholder="وقت الطبخ (دقائق)" type="number" value={newRecipe.cookTime} onChange={e => setNewRecipe({...newRecipe, cookTime: e.target.value})} required style={{ padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />

        <div style={{ border: '1px solid #f1f5f9', padding: '15px', borderRadius: '15px', backgroundColor: '#fcfcfc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>المكونات:</span>
            <button type="button" onClick={() => setShowAddIng(!showAddIng)} style={{ color: '#6366f1', fontSize: '0.8rem', border: 'none', background: 'none', cursor: 'pointer' }}>➕ صنف جديد</button>
          </div>
          {showAddIng && (
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
              <input value={quickIngName} onChange={e => setQuickIngName(e.target.value)} placeholder="اسم المكون.." style={{ flex: 1, padding: '5px', border: '1px solid #6366f1', borderRadius: '5px' }} />
              <button type="button" onClick={handleQuickAddIng} style={{ backgroundColor: '#6366f1', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>إضافة</button>
            </div>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {allIngredients.map(ing => (
              <button key={ing._id} type="button" onClick={() => setSelectedIngredients(prev => prev.includes(ing.name) ? prev.filter(i => i !== ing.name) : [...prev, ing.name])}
                style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid #e2e8f0', fontSize: '0.85rem', cursor: 'pointer',
                  backgroundColor: selectedIngredients.includes(ing.name) ? '#10b981' : '#fff', color: selectedIngredients.includes(ing.name) ? '#fff' : '#475569'
                }}>{ing.name}</button>
            ))}
          </div>
        </div>

        <textarea placeholder="طريقة التحضير" value={newRecipe.instructions} onChange={e => setNewRecipe({...newRecipe, instructions: e.target.value})} required style={{ padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '100px' }} />
        <button type="submit" style={{ padding: '15px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '1.1rem' }}>حفظ الأكلة 📖</button>
      </form>

      {/* عرض الأكلات مقسمة */}
      <div style={{ maxWidth: '600px', margin: '40px auto' }}>
        {['فطار', 'غداء', 'عشاء'].map(cat => {
          const list = recipes.filter(r => r.type.includes(cat));
          if (list.length === 0) return null;
          return (
            <div key={cat} style={{ marginBottom: '30px' }}>
              <h3 style={{ padding: '8px 15px', borderRadius: '10px', display: 'inline-block', fontSize: '1rem', marginBottom: '15px',
                backgroundColor: cat === 'فطار' ? '#fef3c7' : cat === 'غداء' ? '#fee2e2' : '#e0e7ff',
                color: cat === 'فطار' ? '#92400e' : cat === 'غداء' ? '#991b1b' : '#3730a3'
              }}>{cat}</h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                {list.map(recipe => (
                  <div key={recipe._id} style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <div>
                      <strong style={{ color: '#334155' }}>{recipe.title}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>⏱️ {recipe.cookTime} دقيقة | مكونات: {recipe.ingredients.length}</div>
                    </div>
                    <button onClick={() => deleteRecipe(recipe._id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>حذف</button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
