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

  const deleteItem = async (id) => {
    await fetch(`/api/ingredients?id=${id}`, { method: 'DELETE' });
    fetchIngredients();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', color: '#1f2937', marginBottom: '5px' }}>Hum El Num 🍎</h1>
          <p style={{ color: '#6b7280' }}>Manage your kitchen inventory</p>
        </header>

        {/* Form Card */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '25px' }}>
          <form onSubmit={addItem} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              placeholder="What's in the fridge?" 
              value={newItem.name} 
              onChange={e => setNewItem({...newItem, name: e.target.value})} 
              required 
              style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '16px' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                placeholder="Qty" type="number" 
                value={newItem.quantity} 
                onChange={e => setNewItem({...newItem, quantity: e.target.value})} 
                required 
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb' }}
              />
              <input 
                placeholder="Unit (kg/pc)" 
                value={newItem.unit} 
                onChange={e => setNewItem({...newItem, unit: e.target.value})} 
                required 
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb' }}
              />
            </div>
            <button type="submit" style={{ backgroundColor: '#10b981', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
              + Add to Inventory
            </button>
          </form>
        </div>

        {/* Inventory List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {ingredients.map((item) => (
            <div key={item._id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#111827' }}>{item.name}</h3>
                <p style={{ margin: 0, color: '#059669', fontWeight: '600' }}>{item.quantity} {item.unit}</p>
              </div>
              <button 
                onClick={() => deleteItem(item._id)} 
                style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
