'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ChefPage() {
  const [recipes, setRecipes] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [selectedWithAmounts, setSelectedWithAmounts] = useState([]); // {name, value, unit}
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({ title: '', cookTime: '', difficulty: 'سهل', instructions: '' });
  
  // State للإضافة السريعة للمكونات
  const [showAddIng, setShowAddIng] = useState(false);
  const [quickIngName, setQuickIngName] = useState('');

  const units = ['واحدة', 'جرام', 'كيلو', 'مل', 'لتر', 'كوب', 'ملعقة كبيرة', 'ملعقة صغيرة', 'رشة', 'حسب الرغبة'];

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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: quickIngName.trim() }),
    });
    if ((await res.json()).success) {
      setQuickIngName('');
      setShowAddIng(false);
      fetchData(); 
    }
  };

  const handleIngToggle = (name) => {
    const exists = selectedWithAmounts.find(i => i.name === name);
    if (exists) {
      setSelectedWithAmounts(selectedWithAmounts.filter(i => i.name !== name));
    } else {
      setSelectedWithAmounts([...selectedWithAmounts, { name, value: 1, unit: 'واحدة' }]);
    }
  };

  const updateIngredient = (name, field, val) => {
    setSelectedWithAmounts(selectedWithAmounts.map(i => 
      i.name === name ? { ...i, [field]: val } : i
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedTypes.length === 0) return alert("اختار نوع الوجبة (فطار/غداء/عشاء/سناكس)");
    if (selectedWithAmounts.length === 0) return alert("اختار المكونات أولاً");
    
    const res = await fetch('/api/recipes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...newRecipe, 
        type: selectedTypes, 
        ingredients: selectedWithAmounts,
        cookTime: Number(newRecipe.cookTime) 
      }),
    });

    const result = await res.json();
    if (result.success) {
      alert("تمت إضافة الوصفة بنجاح!");
      setNewRecipe({ title: '', cookTime: '', difficulty: 'سهل', instructions: '' });
      setSelectedWithAmounts([]); setSelectedTypes([]); fetchData();
    } else { alert(result.error); }
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

      <h1 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '30px' }}>👨‍🍳 مطبخ الشيف</h1>
      
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '25px', maxWidth: '600px', margin: '0 auto', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input placeholder="اسم الأكلة" value={newRecipe.title} onChange={e => setNewRecipe({...newRecipe, title: e.target.value})} required style={{ padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem' }} />
        
        <div style={{ border: '1px solid #f1f5f9', padding: '10px', borderRadius: '15px' }}>
          <p style={{ margin: '0 0 10px 5px', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b' }}>مستوى الصعوبة:</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['سهل', 'متوسط', 'صعب'].map(d => (
              <button key={d} type="button" onClick={() => setNewRecipe({...newRecipe, difficulty: d})}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer', border: '1px solid #e2e8f0',
                  backgroundColor: newRecipe.difficulty === d ? '#f59e0b' : '#fff', color: newRecipe.difficulty === d ? '#fff' : '#64748b',
                  fontWeight: 'bold', transition: '0.2s'
                }}>{d}</button>
            ))}
          </div>
        </div>

        {/* نوع الوجبة - تم إضافة سناكس وتفعيل الـ Wrap */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['فطار', 'غداء', 'عشاء', 'سناكس'].map(t => (
            <button key={t} type="button" onClick={() => setSelectedTypes(prev => prev.includes(t) ? prev.filter(i => i !== t) : [...prev, t])}
              style={{ flex: '1 1 80px', padding: '12px', borderRadius: '12px', cursor: 'pointer', border: '1px solid #e2e8f0',
                backgroundColor: selectedTypes.includes(t) ? '#6366f1' : '#fff', color: selectedTypes.includes(t) ? '#fff' : '#64748b',
                fontWeight: 'bold'
              }}>{t}</button>
          ))}
        </div>

        <input placeholder="وقت الطبخ (دقائق)" type="number" value={newRecipe.cookTime} onChange={e => setNewRecipe({...newRecipe, cookTime: e.target.value})} required style={{ padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />

        <div style={{ border: '1px solid #f1f5f9', padding: '15px', borderRadius: '20px', backgroundColor: '#fcfcfc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#1e293b' }}>المكونات المطلوبة:</span>
            <button type="button" onClick={() => setShowAddIng(!showAddIng)} style={{ color: '#6366f1', fontSize: '0.85rem', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
              {showAddIng ? 'إغلاق' : '➕ مكون جديد'}
            </button>
          </div>

          {showAddIng && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', padding: '10px', backgroundColor: '#eef2ff', borderRadius: '12px' }}>
              <input value={quickIngName} onChange={e => setQuickIngName(e.target.value)} placeholder="اسم الصنف (مثلاً: فلفل ألوان)" style={{ flex: 1, padding: '8px', border: '1px solid #6366f1', borderRadius: '8px' }} />
              <button type="button" onClick={handleQuickAddIng} style={{ backgroundColor: '#6366f1', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold' }}>إضافة</button>
            </div>
          )}
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {allIngredients.map(ing => {
              const isSelected = selectedWithAmounts.some(i => i.name === ing.name);
              return (
                <button key={ing._id} type="button" onClick={() => handleIngToggle(ing.name)}
                  style={{ padding: '8px 15px', borderRadius: '20px', border: '1px solid #e2e8f0', fontSize: '0.85rem', cursor: 'pointer',
                    backgroundColor: isSelected ? '#10b981' : '#fff', color: isSelected ? '#fff' : '#475569', transition: '0.2s'
                  }}>{ing.name}</button>
              );
            })}
          </div>

          {selectedWithAmounts.map(item => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', backgroundColor: '#fff', padding: '12px', borderRadius: '15px', border: '1px solid #f1f5f9' }}>
              <span style={{ flex: 1, fontWeight: 'bold', fontSize: '0.9rem', color: '#334155' }}>{item.name}</span>
              <input type="number" value={item.value} onChange={(e) => updateIngredient(item.name, 'value', Number(e.target.value))} 
                style={{ width: '65px', padding: '8px', borderRadius: '10px', border: '1px solid #ddd', textAlign: 'center' }} />
              <select value={item.unit} onChange={(e) => updateIngredient(item.name, 'unit', e.target.value)}
                style={{ width: '110px', padding: '8px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer' }}>
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          ))}
        </div>

        <textarea placeholder="طريقة التحضير بالخطوات..." value={newRecipe.instructions} onChange={e => setNewRecipe({...newRecipe, instructions: e.target.value})} required style={{ padding: '15px', borderRadius: '15px', border: '1px solid #e2e8f0', minHeight: '120px', lineHeight: '1.6' }} />
        
        <button type="submit" style={{ padding: '18px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '18px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)' }}>
          حفظ الوصفة في الكتاب 📖
        </button>
      </form>

      {/* عرض الأكلات المسجلة - تم إضافة سناكس */}
      <div style={{ maxWidth: '600px', margin: '50px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#1e293b' }}>📖 قائمة الوصفات</h2>
        {['فطار', 'غداء', 'عشاء', 'سناكس'].map(cat => {
          const list = recipes.filter(r => r.type.includes(cat));
          if (list.length === 0) return null;
          return (
            <div key={cat} style={{ marginBottom: '35px' }}>
              <h3 style={{ padding: '8px 18px', borderRadius: '12px', display: 'inline-block', fontSize: '0.9rem', marginBottom: '15px',
                backgroundColor: cat === 'فطار' ? '#fef3c7' : cat === 'غداء' ? '#fee2e2' : cat === 'عشاء' ? '#e0e7ff' : '#f0fdf4',
                color: cat === 'فطار' ? '#92400e' : cat === 'غداء' ? '#991b1b' : cat === 'عشاء' ? '#3730a3' : '#166534'
              }}>
                {cat === 'فطار' ? '🍳 فطار' : cat === 'غداء' ? '🍗 غداء' : cat === 'عشاء' ? '🥪 عشاء' : '🍿 سناكس'}
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {list.map(recipe => (
                  <div key={recipe._id} style={{ backgroundColor: '#fff', padding: '18px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
                    <div>
                      <strong style={{ color: '#334155', fontSize: '1.05rem' }}>{recipe.title}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                         📊 {recipe.difficulty} | ⏱️ {recipe.cookTime} دقيقة
                      </div>
                    </div>
                    <button onClick={() => deleteRecipe(recipe._id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', padding: '5px 10px' }}>حذف</button>
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
