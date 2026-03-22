'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ChefPage() {
  const [recipes, setRecipes] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({ title: '', cookTime: '', difficulty: 'سهل', instructions: '' });
  
  // State لإضافة مكون جديد بسرعة
  const [showAddIng, setShowAddIng] = useState(false);
  const [quickIngName, setQuickIngName] = useState('');

  const fetchData = async () => {
    const resR = await fetch('/api/recipes'); const jsonR = await resR.json();
    if (jsonR.success) setRecipes(jsonR.data);
    const resI = await fetch('/api/ingredients'); const jsonI = await resI.json();
    if (jsonI.success) setAllIngredients(jsonI.data);
  };

  useEffect(() => { fetchData(); }, []);

  // دالة إضافة مكون جديد من داخل صفحة الشيف
  const handleQuickAddIng = async () => {
    if (!quickIngName.trim()) return;
    const res = await fetch('/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: quickIngName.trim() }),
    });
    if ((await res.json()).success) {
      setQuickIngName('');
      setShowAddIng(false);
      fetchData(); // تحديث القائمة عشان المكون الجديد يظهر
    }
  };

  const handleTypeToggle = (t) => {
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(item => item !== t) : [...prev, t]);
  };

  const handleIngToggle = (name) => {
    setSelectedIngredients(prev => prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedTypes.length === 0) return alert("اختار نوع الوجبة");
    const data = { ...newRecipe, type: selectedTypes, ingredients: selectedIngredients, cookTime: Number(newRecipe.cookTime) };
    const res = await fetch('/api/recipes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if ((await res.json()).success) {
      alert("تم الحفظ!");
      setNewRecipe({ title: '', cookTime: '', difficulty: 'سهل', instructions: '' });
      setSelectedIngredients([]); setSelectedTypes([]); fetchData();
    }
  };

  return (
    <div dir="rtl" style={{ padding: '20px', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Link href="/" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 'bold' }}>⬅️ الرئيسية</Link>
        <Link href="/store" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 'bold' }}>📦 فتح المخزن</Link>
      </div>

      <h1 style={{ textAlign: 'center' }}>👨‍🍳 مطبخ الشيف</h1>
      
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '20px', maxWidth: '600px', margin: '20px auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input placeholder="اسم الأكلة" value={newRecipe.title} onChange={e => setNewRecipe({...newRecipe, title: e.target.value})} required style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {['فطار', 'غداء', 'عشاء'].map(t => (
            <button key={t} type="button" onClick={() => handleTypeToggle(t)}
              style={{ flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer', border: '1px solid #ddd',
                backgroundColor: selectedTypes.includes(t) ? '#6366f1' : '#fff',
                color: selectedTypes.includes(t) ? '#fff' : '#666'
              }}>{t}</button>
          ))}
        </div>

        <input placeholder="الوقت بالدقائق" type="number" value={newRecipe.cookTime} onChange={e => setNewRecipe({...newRecipe, cookTime: e.target.value})} required style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} />

        {/* قسم المكونات مع زرار الإضافة السريعة */}
        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
             <p style={{ margin: 0, fontWeight: 'bold' }}>المكونات المتاحة:</p>
             <button type="button" onClick={() => setShowAddIng(!showAddIng)} style={{ color: '#6366f1', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>
               ➕ صنف جديد
             </button>
          </div>

          {showAddIng && (
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
              <input value={quickIngName} onChange={e => setQuickIngName(e.target.value)} placeholder="اسم الصنف.." style={{ flex: 1, padding: '5px', borderRadius: '5px', border: '1px solid #6366f1' }} />
              <button type="button" onClick={handleQuickAddIng} style={{ backgroundColor: '#6366f1', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>إضافة</button>
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {allIngredients.map(ing => (
              <button key={ing._id} type="button" onClick={() => handleIngToggle(ing.name)}
                style={{ padding: '5px 10px', borderRadius: '15px', border: '1px solid #ddd', fontSize: '0.8rem',
                  backgroundColor: selectedIngredients.includes(ing.name) ? '#10b981' : '#fff',
                  color: selectedIngredients.includes(ing.name) ? '#fff' : '#666'
                }}>{ing.name}</button>
            ))}
          </div>
        </div>

        <textarea placeholder="طريقة التحضير" value={newRecipe.instructions} onChange={e => setNewRecipe({...newRecipe, instructions: e.target.value})} required style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', minHeight: '100px' }} />
        <button type="submit" style={{ padding: '15px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>حفظ الوصفة</button>
      </form>
    </div>
  );
}
