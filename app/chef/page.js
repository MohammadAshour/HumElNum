'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ChefPage() {
  const [recipes, setRecipes] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [selectedWithAmounts, setSelectedWithAmounts] = useState([]); // {name, value, unit}
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({ title: '', cookTime: '', difficulty: 'سهل', instructions: '' });
  
  const units = ['واحدة', 'جرام', 'كيلو', 'مل', 'لتر', 'كوب', 'ملعقة كبيرة', 'ملعقة صغيرة', 'رشة', 'حسب الرغبة'];

  const fetchData = async () => {
    const resR = await fetch('/api/recipes'); const jsonR = await resR.json();
    if (jsonR.success) setRecipes(jsonR.data);
    const resI = await fetch('/api/ingredients'); const jsonI = await resI.json();
    if (jsonI.success) setAllIngredients(jsonI.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleIngToggle = (name) => {
    const exists = selectedWithAmounts.find(i => i.name === name);
    if (exists) {
      setSelectedWithAmounts(selectedWithAmounts.filter(i => i.name !== name));
    } else {
      // القيمة الافتراضية عند الاختيار
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
    if (selectedTypes.length === 0) return alert("اختار نوع الوجبة");
    
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

  return (
    <div dir="rtl" style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '700px', margin: '0 auto 20px auto' }}>
        <Link href="/" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 'bold' }}>🏠 الرئيسية</Link>
        <Link href="/store" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 'bold' }}>📦 المخزن</Link>
      </div>

      <h1 style={{ textAlign: 'center', color: '#1e293b' }}>👨‍🍳 مطبخ الشيف</h1>
      
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '25px', maxWidth: '600px', margin: '0 auto', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input placeholder="اسم الأكلة" value={newRecipe.title} onChange={e => setNewRecipe({...newRecipe, title: e.target.value})} required style={{ padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
        
        {/* مستوى الصعوبة */}
        <div style={{ border: '1px solid #f1f5f9', padding: '10px', borderRadius: '12px' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', fontWeight: 'bold' }}>مستوى الصعوبة:</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['سهل', 'متوسط', 'صعب'].map(d => (
              <button key={d} type="button" onClick={() => setNewRecipe({...newRecipe, difficulty: d})}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer', border: '1px solid #e2e8f0',
                  backgroundColor: newRecipe.difficulty === d ? '#f59e0b' : '#fff', color: newRecipe.difficulty === d ? '#fff' : '#64748b'
                }}>{d}</button>
            ))}
          </div>
        </div>

        {/* نوع الوجبة */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {['فطار', 'غداء', 'عشاء'].map(t => (
            <button key={t} type="button" onClick={() => setSelectedTypes(prev => prev.includes(t) ? prev.filter(i => i !== t) : [...prev, t])}
              style={{ flex: 1, padding: '10px', borderRadius: '12px', cursor: 'pointer', border: '1px solid #e2e8f0',
                backgroundColor: selectedTypes.includes(t) ? '#6366f1' : '#fff', color: selectedTypes.includes(t) ? '#fff' : '#64748b'
              }}>{t}</button>
          ))}
        </div>

        <input placeholder="وقت الطبخ (دقائق)" type="number" value={newRecipe.cookTime} onChange={e => setNewRecipe({...newRecipe, cookTime: e.target.value})} required style={{ padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />

        {/* المكونات والكميات المفصلة */}
        <div style={{ border: '1px solid #f1f5f9', padding: '15px', borderRadius: '15px', backgroundColor: '#fcfcfc' }}>
          <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '10px' }}>اختر المكونات وحدد الكمية الدقيقة:</p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
            {allIngredients.map(ing => (
              <button key={ing._id} type="button" onClick={() => handleIngToggle(ing.name)}
                style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid #e2e8f0', fontSize: '0.85rem', cursor: 'pointer',
                  backgroundColor: selectedWithAmounts.some(i => i.name === ing.name) ? '#10b981' : '#fff', 
                  color: selectedWithAmounts.some(i => i.name === ing.name) ? '#fff' : '#475569'
                }}>{ing.name}</button>
            ))}
          </div>

          {/* تفاصيل الكمية لكل مكون مختار */}
          {selectedWithAmounts.map(item => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', backgroundColor: '#fff', padding: '10px', borderRadius: '12px', border: '1px solid #eee' }}>
              <span style={{ flex: 1, fontWeight: 'bold', fontSize: '0.9rem' }}>{item.name}</span>
              
              <input 
                type="number" 
                placeholder="العدد" 
                value={item.value} 
                onChange={(e) => updateIngredient(item.name, 'value', Number(e.target.value))}
                style={{ width: '60px', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center' }}
              />

              <select 
                value={item.unit} 
                onChange={(e) => updateIngredient(item.name, 'unit', e.target.value)}
                style={{ width: '100px', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff' }}
              >
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          ))}
        </div>

        <textarea placeholder="طريقة التحضير" value={newRecipe.instructions} onChange={e => setNewRecipe({...newRecipe, instructions: e.target.value})} required style={{ padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '100px' }} />
        <button type="submit" style={{ padding: '15px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '1.1rem' }}>حفظ الأكلة 📖</button>
      </form>
    </div>
  );
}
