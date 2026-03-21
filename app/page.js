'use client';
import { useState, useEffect } from 'react';

export default function InventoryPage() {
  const [ingredients, setIngredients] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '' });

  const fetchIngredients = async () => {
    try {
      const res = await fetch('/api/ingredients');
      const json = await res.json();
      if (json.success) {
        setIngredients(json.data || []); // التأكد من وجود مصفوفة حتى لو فارغة
      }
    } catch (err) {
      console.error("Error fetching:", err);
    }
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

  const updateQuantity = async (id, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 0) return;
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '15px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '450px', margin: '0 auto' }}>
        
        <h1 style={{ textAlign: 'center', color: '#1f2937' }}>Hum El Num 🍎</h1>

        {/* Input Form Card */}
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <form onSubmit={addItem} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input placeholder="Qty" type="number" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: e.target.value})} required style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minWidth: '0' }} />
              <input placeholder="Unit" value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} required style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minWidth: '0' }} />
            </div>
            <button type="submit" style={{ backgroundColor: '#10b981', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>Add to Fridge</button>
          </form>
        </div>

        {/* Ingredients List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {ingredients.length > 0 ? ingredients.map((item) => (
            <div key={item._id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{item.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                  <button onClick={() => updateQuantity(item._id, item.quantity, -1)} style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd' }}>-</button>
                  <span style={{ fontWeight: 'bold', color: '#059669' }}>{item.quantity} {item.unit}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity, 1)} style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd' }}>+</button>
                </div>
              </div>
              <button onClick={() => deleteItem(item._id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
            </div>
          )) : <p style={{ textAlign: 'center', color: '#999' }}>Fridge is empty!</p>}
        </div>

      </div>
    </div>
  );
}
