'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StorePage() {
  const [ingredients, setIngredients] = useState([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);

  // جلب البيانات من الداتا بيز
  const fetchIngredients = async () => {
    try {
      const res = await fetch('/api/ingredients');
      const json = await res.json();
      if (json.success) setIngredients(json.data);
    } catch (err) {
      console.error("Error fetching store:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  // إضافة صنف جديد للمخزن
  const addIngredient = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    await fetch('/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    });
    setNewName('');
    fetchIngredients();
  };

  // تغيير حالة الصنف (متاح / خلصان)
  const toggleStatus = async (id) => {
    await fetch(`/api/ingredients?id=${id}`, { method: 'PUT' });
    fetchIngredients();
  };

  // حذف الصنف نهائياً
  const deleteItem = async (id) => {
    if (confirm("هل تريد حذف هذا الصنف نهائياً من القائمة؟")) {
      await fetch(`/api/ingredients?id=${id}`, { method: 'DELETE' });
      fetchIngredients();
    }
  };

  return (
    <div dir="rtl" style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* روابط التنقل السريع */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#6366f1', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
            🏠 الرئيسية
          </Link>
          <Link href="/chef" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 'bold', backgroundColor: '#eef2ff', padding: '8px 15px', borderRadius: '10px', border: '1px solid #c7d2fe' }}>
            👨‍🍳 العودة للشيف
          </Link>
        </div>

        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2.2rem', color: '#111827', margin: '0' }}>📦 مخزن البيت</h1>
          <p style={{ color: '#6b7280', marginTop: '5px' }}>اضغطي على الصنف لتغيير حالته (متاح/خلصان)</p>
        </header>

        {/* فورم إضافة صنف جديد */}
        <form onSubmit={addIngredient} style={{ display: 'flex', gap: '10px', marginBottom: '35px' }}>
          <input 
            placeholder="إضافة صنف جديد للمخزن..." 
            value={newName} 
            onChange={e => setNewName(e.target.value)}
            style={{ flex: 1, padding: '15px', borderRadius: '15px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '0 25px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
            إضافة
          </button>
        </form>

        {/* عرض المكونات */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>جاري تحميل المخزن...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px' }}>
            {ingredients.map(item => (
              <div key={item._id} style={{ position: 'relative' }}>
                <div 
                  onClick={() => toggleStatus(item._id)}
                  style={{
                    padding: '20px 10px',
                    borderRadius: '18px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: '0.2s',
                    backgroundColor: item.isAvailable ? '#dcfce7' : '#fff',
                    border: item.isAvailable ? '2px solid #22c55e' : '2px solid #f1f5f9',
                    color: item.isAvailable ? '#166534' : '#94a3b8',
                    boxShadow: item.isAvailable ? '0 4px 6px rgba(34, 197, 94, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)',
                    fontWeight: 'bold'
                  }}
                >
                  <div style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{item.name}</div>
                  <div style={{ fontSize: '0.7rem' }}>{item.isAvailable ? '✅ متاح' : '❌ خلصان'}</div>
                </div>
                
                {/* زرار الحذف الصغير */}
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteItem(item._id); }}
                  style={{
                    position: 'absolute', top: '-5px', left: '-5px',
                    backgroundColor: '#fee2e2', color: '#ef4444', border: 'none',
                    borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {ingredients.length === 0 && !loading && (
          <div style={{ textAlign: 'center', marginTop: '60px', color: '#cbd5e1', border: '2px dashed #f1f5f9', padding: '40px', borderRadius: '20px' }}>
            المخزن لسه فاضي.. ابدأي بإضافة مكوناتك الأساسية!
          </div>
        )}
      </div>
    </div>
  );
}
