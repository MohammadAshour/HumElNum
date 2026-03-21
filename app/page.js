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
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '15px', fontFamily: 'system-ui', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '1.8rem', color: '#1f2937', marginBottom: '5px' }}>Hum El Num 🍎</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Kitchen Inventory Management</p>
        </header>

        {/* Form Card */}
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <form onSubmit={addItem} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              placeholder="Ingredient Name" 
              value={newItem.name} 
              onChange={e => setNewItem({...newItem, name: e.target.value})} 
              required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '16px', width: '100%', boxSizing: 'border-box' }}
            />
            
            {/* القفلة هنا: عرض الخانتين جنب بعض بالتساوي */}
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <input 
                placeholder="Qty" type="number" 
                value={newItem.quantity} 
                onChange={e => setNewItem({...newItem, quantity: e.target.value})} 
                required 
                style={{ flex: '1', minWidth: '0', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '16px', boxSizing: 'border-box' }}
              />
              <input 
                placeholder="Unit" 
                value={newItem.unit} 
                onChange={e => setNewItem({...newItem, unit: e.target.value})} 
                required 
                style={{ flex: '1', minWidth: '0', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '16px', boxSizing: 'border-box' }}
              />
            </div>

            <button type="submit" style={{ backgroundColor: '#10b981', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '5px' }}>
              + Add to Fridge
            </button>
          </form>
        </div>

        {/* Inventory List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {ingredients.map((item) => (
            <div key={item._id} style={{ backgroundColor: 'white', padding: '12px 15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#111827' }}>{item.name}</h3>
                <p style={{ margin: 0, color: '#059669', fontWeight: '600', fontSize: '14px' }}>
                  {item.quantity} {item.unit}
                </p>
              </div>
              <button 
                onClick={() => deleteItem(item._id)} 
                style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
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
