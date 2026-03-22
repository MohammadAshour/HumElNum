'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StorePage() {
  const [ingredients, setIngredients] = useState([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch all ingredients from the database
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

  // Add a new item to the master list
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

  // Toggle availability (In Stock / Out of Stock)
  const toggleStatus = async (id) => {
    await fetch(`/api/ingredients?id=${id}`, { method: 'PUT' });
    fetchIngredients(); // Refresh UI
  };

  // Delete item from master list
  const deleteItem = async (id) => {
    if (confirm("حذف المكون ده نهائياً من القائمة؟")) {
      await fetch(`/api/ingredients?id=${id}`, { method: 'DELETE' });
      fetchIngredients();
    }
  };

  return (
    <div dir="rtl" style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      
      {/* Header & Back Button */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#6366f1', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px' }}>
          <span>⬅️</span> العودة للمنيو الرئيسي
        </Link>

        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', color: '#111827' }}>📦 مخزن البيت</h1>
          <p style={{ color: '#6b7280' }}>حددي الحاجات اللي موجودة عندك عشان الشيف يقترح أكلات</p>
        </header>

        {/* Form to add new items */}
        <form onSubmit={addIngredient} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <input 
            placeholder="إضافة صنف جديد (مثلاً: دقيق، زيت..)" 
            value={newName} 
            onChange={e => setNewName(e.target.value)}
            style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem' }}
          />
          <button type="submit" style={{ padding: '12px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
            إضافة
          </button>
        </form>

        {/* Ingredients Grid */}
        {loading ? (
          <p style={{ textAlign: 'center' }}>جاري تحميل المخزن...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
            {ingredients.map(item => (
              <div 
                key={item._id}
                style={{ position: 'relative' }}
              >
                <div 
                  onClick={() => toggleStatus(item._id)}
                  style={{
                    padding: '20px',
                    borderRadius: '15px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: item.isAvailable ? '#dcfce7' : '#ffffff',
                    border: item.isAvailable ? '2px solid #22c55e' : '2px solid #e5e7eb',
                    color: item.isAvailable ? '#166534' : '#6b7280',
                    boxShadow: item.isAvailable ? '0 4px 6px rgba(34, 197, 94, 0.1)' : 'none',
                    fontWeight: 'bold'
                  }}
                >
                  <div style={{ fontSize: '1.1rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', marginTop: '5px' }}>
                    {item.isAvailable ? '✅ متاح' : '❌ خلصان'}
                  </div>
                </div>
                
                {/* Small delete button for cleaning the list */}
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteItem(item._id); }}
                  style={{
                    position: 'absolute', top: '-5px', left: '-5px',
                    backgroundColor: '#fee2e2', color: '#ef4444', border: 'none',
                    borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '12px'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {ingredients.length === 0 && !loading && (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#94a3b8' }}>
            المخزن فاضي.. ابدأي بإضافة الأساسيات اللي بتحتاجيها دايماً.
          </div>
        )}
      </div>
    </div>
  );
}
