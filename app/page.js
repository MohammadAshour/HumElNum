'use client';
import { useState, useEffect } from 'react';

export default function HomeInventory() {
  const [ingredients, setIngredients] = useState([]);
  const [newName, setNewName] = useState('');

  const fetchIngredients = async () => {
    const res = await fetch('/api/ingredients');
    const json = await res.json();
    if (json.success) setIngredients(json.data);
  };

  useEffect(() => { fetchIngredients(); }, []);

  const addIngredient = async (e) => {
    e.preventDefault();
    if (!newName) return;
    await fetch('/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
    setNewName('');
    fetchIngredients();
  };

  const toggleStatus = async (id) => {
    await fetch(`/api/ingredients?id=${id}`, { method: 'PUT' });
    fetchIngredients();
  };

  return (
    <div dir="rtl" style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#111827' }}>تلاجة هم النم 🍎</h1>
        <p style={{ color: '#6b7280' }}>اضغطي على المكون لتغيير حالته</p>
      </header>

      {/* Form to add new Master Ingredient */}
      <form onSubmit={addIngredient} style={{ maxWidth: '500px', margin: '0 auto 30px', display: 'flex', gap: '10px' }}>
        <input 
          placeholder="إضافة مكون جديد للأساسيات..." 
          value={newName} 
          onChange={e => setNewName(e.target.value)}
          style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
        />
        <button type="submit" style={{ padding: '12px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>
          إضافة
        </button>
      </form>

      {/* Grid of Ingredients */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px', maxWidth: '800px', margin: '0 auto' }}>
        {ingredients.map(item => (
          <div 
            key={item._id}
            onClick={() => toggleStatus(item._id)}
            style={{
              padding: '20px',
              borderRadius: '15px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: item.isAvailable ? '#dcfce7' : '#f3f4f6',
              border: item.isAvailable ? '2px solid #22c55e' : '2px solid #d1d5db',
              color: item.isAvailable ? '#166534' : '#6b7280',
              boxShadow: item.isAvailable ? '0 4px 6px rgba(34, 197, 94, 0.1)' : 'none'
            }}
          >
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{item.name}</div>
            <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>
              {item.isAvailable ? '✅ موجود' : '❌ خلصان'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
