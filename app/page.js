'use client';
import { useState, useEffect } from 'react';

export default function InventoryPage() {
  const [ingredients, setIngredients] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '' });

  // Fetch all ingredients
  const fetchIngredients = async () => {
    try {
      const res = await fetch('/api/ingredients');
      const json = await res.json();
      if (json.success) setIngredients(json.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  // Add new item
  const addItem = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    if (res.ok) {
      setNewItem({ name: '', quantity: '', unit: '' });
      fetchIngredients();
    }
  };

  // Delete item
  const deleteItem = async (id) => {
    const res = await fetch(`/api/ingredients?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchIngredients();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Hum El Num Inventory 🍎</h1>
      
      <form onSubmit={addItem} style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
        <input 
          placeholder="Ingredient Name (e.g. Eggs)" 
          value={newItem.name} 
          onChange={(e) => setNewItem({...newItem, name: e.target.value})} 
          required 
          style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input 
          placeholder="Quantity" 
          type="number" 
          value={newItem.quantity} 
          onChange={(e) => setNewItem({...newItem, quantity: e.target.value})} 
          required 
          style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input 
          placeholder="Unit (e.g. kg, piece)" 
          value={newItem.unit} 
          onChange={(e) => setNewItem({...newItem, unit: e.target.value})} 
          required 
          style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Add to Fridge
        </button>
      </form>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th>Ingredient</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((item) => (
            <tr key={item._id}>
              <td style={{ fontWeight: 'bold' }}>{item.name}</td>
              <td style={{ color: '#007bff', fontWeight: 'bold' }}>{item.quantity}</td>
              <td>{item.unit}</td>
              <td>
                <button 
                  onClick={() => deleteItem(item._id)} 
                  style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
