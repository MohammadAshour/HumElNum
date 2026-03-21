'use client';
import { useState, useEffect } from 'react';

export default function InventoryPage() {
  const [ingredients, setIngredients] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '' });

  const fetchIngredients = async () => {
    const res = await fetch('/api/ingredients');
    const json = await res.json();
    if (json.success) setIngredients(json.data);
  };

  useEffect(() => { fetchIngredients(); }, []);

  const addItem = async (e) => {
    e.preventDefault();
    await fetch('/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    setNewItem({ name: '', quantity: '', unit: '' });
    fetchIngredients();
  };

  // دالة التحديث الجديدة
  const updateQuantity = async (id, newQty) => {
    if (newQty < 0) return; // نمنع الأرقام السالبة
    await fetch(`/api/ingredients?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQty }),
    });
    fetchIngredients();
  };

  const deleteItem = async (id) => {
    await fetch(`/api/ingredients?id=${id}`, { method: 'DELETE' });
    fetchIngredients();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '15px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '1.8rem', color: '#1f2937' }}>Hum El Num 🍎</h1>
        </header>

        {/* Form Card */}
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <form onSubmit={addItem} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '16px' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input placeholder="Qty" type="number" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: e.target.value})} required style={{ flex: '1', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', minWidth: '0' }} />
              <input placeholder="Unit" value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} required style={{ flex: '1', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', minWidth: '0' }} />
            </div>
            <button type="submit" style={{ backgroundColor: '#10b981', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>+ Add</button>
          </form>
        </div>

        {/* Inventory List with Update buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {ingredients.map((item) => (
            <div key={item._id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{item.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                  {/* أزرار التحكم في الكمية */}
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{ width: '25px', height: '25px', borderRadius: '50%', border: '1px solid #d1d5db', background: '#f3f4f6', cursor: 'pointer' }}>-</button>
                  <span style={{ fontWeight: '600', color: '#059669' }}>{item.quantity} {item.unit}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{ width: '25px', height: '25px', borderRadius: '50%', border: '1px solid #d1d5db', background: '#f3f4f6', cursor: 'pointer' }}>+</button>
                </div>
              </div>
              <button onClick={() => deleteItem(item._id)} style={{ backgroundColor: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
