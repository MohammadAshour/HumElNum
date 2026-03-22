'use client';
import { useState, useEffect } from 'react';

export default function InventoryPage() {
  const [ingredients, setIngredients] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '' });

  const fetchIngredients = async () => {
    try {
      const res = await fetch('/api/ingredients');
      const json = await res.json();
      if (json.success) setIngredients(json.data || []);
    } catch (err) {
      console.error("خطأ في جلب البيانات:", err);
    }
  };

  useEffect(() => { fetchIngredients(); }, []);

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.unit) {
      alert("من فضلك اختر الوحدة");
      return;
    }
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
    if (confirm("هل أنت متأكد من الحذف؟")) {
      await fetch(`/api/ingredients?id=${id}`, { method: 'DELETE' });
      fetchIngredients();
    }
  };

  return (
    <div dir="rtl" style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '15px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '450px', margin: '0 auto' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '2rem', color: '#1f2937' }}>مخزن هم النم 🍎</h1>
          <p style={{ color: '#6b7280' }}>إدارة محتويات الثلاجة بسهولة</p>
        </header>

        {/* كارت الإضافة */}
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <form onSubmit={addItem} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              placeholder="اسم المكون (مثلاً: بيض)" 
              value={newItem.name} 
              onChange={e => setNewItem({...newItem, name: e.target.value})} 
              required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }} 
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                placeholder="الكمية" 
                type="number" 
                value={newItem.quantity} 
                onChange={e => setNewItem({...newItem, quantity: e.target.value})} 
                required 
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minWidth: '0' }} 
              />
              <select 
                value={newItem.unit} 
                onChange={e => setNewItem({...newItem, unit: e.target.value})} 
                required 
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: 'white' }}
              >
                <option value="" disabled>الوحدة</option>
                <option value="جرام">جرام</option>
                <option value="قطعة">قطعة</option>
                <option value="مللي">مللي</option>
              </select>
            </div>
            <button type="submit" style={{ backgroundColor: '#10b981', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
              إضافة للمخزن
            </button>
          </form>
        </div>

        {/* قائمة المحتويات */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {ingredients.length > 0 ? ingredients.map((item) => (
            <div key={item._id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#111827' }}>{item.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                  <button onClick={() => updateQuantity(item._id, item.quantity, -1)} style={{ width: '35px', height: '35px', borderRadius: '50%', border: '1px solid #ddd', backgroundColor: '#f3f4f6', cursor: 'pointer', fontSize: '18px' }}>-</button>
                  <span style={{ fontWeight: 'bold', color: '#059669', minWidth: '60px', textAlign: 'center' }}>
                    {item.quantity} {item.unit}
                  </span>
                  <button onClick={() => updateQuantity(item._id, item.quantity, 1)} style={{ width: '35px', height: '35px', borderRadius: '50%', border: '1px solid #ddd', backgroundColor: '#f3f4f6', cursor: 'pointer', fontSize: '18px' }}>+</button>
                </div>
              </div>
              <button 
                onClick={() => deleteItem(item._id)} 
                style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}
              >
                حذف
              </button>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
              <p>الثلاجة فاضية.. ابدأ أضف مكونات!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
