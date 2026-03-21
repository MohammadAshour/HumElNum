'use client';
import { useState, useEffect } from 'react';

export default function InventoryPage() {
  const [ingredients, setIngredients] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '' });

  // Fetch ingredients from our API
  const fetchIngredients = async () => {
    const res = await fetch('/api/ingredients');
    const json = await res.json();
    if (json.success) setIngredients(json.data);
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  // Handle adding new ingredient
  const addItem = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    if (res.ok) {
      setNewItem({ name: '', quantity: '', unit: '' });
      fetchIngredients(); // Refresh the list
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Hum El Num Inventory 🍎</h1>
      
      {/* Add New Item Form */}
      <form onSubmit={addItem} style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexDirection: 'column', maxWidth: '300px' }}>
        <input 
          placeholder="Name" 
          value={newItem.name} 
          onChange={(e) => setNewItem({...newItem, name: e.target.value})} 
          required 
        />
        <input 
          placeholder="Quantity" 
          type="number" 
          value={newItem.quantity} 
          onChange={(e) => setNewItem({...newItem, quantity: e.target.value})} 
          required 
        />
        <input 
          placeholder="Unit (e.g. kg, piece)" 
          value={newItem.unit} 
          onChange={(e) => setNewItem({...newItem, unit: e.target.value})} 
          required 
        />
        <button type="submit">Add to Fridge</button>
      </form>

      {/* Inventory Table */}
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#eee' }}>
            <th>Ingredient</th>
            <th>Quantity</th>
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
