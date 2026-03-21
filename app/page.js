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
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1>Hum El Num Inventory 🍎</h1>
      <form onSubmit={addItem} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <input placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
        <input placeholder="Qty" type="number" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: e.target.value})} required />
        <input placeholder="Unit" value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} required />
        <button type="submit" style={{ background: 'green', color: 'white' }}>Add</button>
      </form>

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>X</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((item) => (
            <tr key={item._id} style={{ textAlign: 'center' }}>
              <td>{item.name}</td>
              <td style={{ fontWeight: 'bold', color: 'blue' }}>{item.quantity}</td>
              <td>{item.unit}</td>
              <td><button onClick={() => deleteItem(item._id)}>Del</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
