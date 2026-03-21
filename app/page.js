'use client';
import { useState, useEffect } from 'react';

export default function InventoryPage() {
  const [ingredients, setIngredients] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 0, unit: '' });

  const fetchIngredients = async () => {
    try {
      const res = await fetch('/api/ingredients');
      const json = await res.json();
      if (json.success) setIngredients(json.data);
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const addItem = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    if (res.ok) {
      setNewItem({ name: '', quantity: 0, unit: '' });
      fetchIngredients();
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Hum El Num Inventory 🍎</h1>
      
      <form onSubmit={addItem} style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
        <input 
          placeholder="Ingredient Name" 
          value={newItem.name} 
          onChange={(e) => setNewItem({...newItem, name: e.target.value})} 
          required 
          style={{ padding: '10px' }}
        />
        <input 
          placeholder="Quantity" 
          type="number" 
          value={newItem.quantity} 
          onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})} 
          required 
          style={{ padding: '10px' }}
        />
        <input 
          placeholder="Unit (e.g. kg, piece)" 
          value={newItem.unit} 
          onChange={(e) => setNewItem({...newItem, unit: e.target.value})} 
          required 
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
          Add to Fridge
        </button>
      </form>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th>Ingredient</th>
            <th>Qty</th>
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
