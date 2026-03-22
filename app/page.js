'use client';
import { useState, useEffect } from 'react';

export default function InventoryPage() {
  const [ingredients, setIngredients] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '' });

  // جلب البيانات من السيرفر
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

  // إضافة صنف جديد
  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.unit) {
      alert("من فضلك اختر الوحدة أولاً");
      return;
    }
    await fetch('/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    setNewItem({ name: '', quantity: '', unit: '' }); // إعادة تصفير الحقول
    fetchIngredients();
  };

  // تعديل الكمية بمنطق ذكي (Context-aware Logic)
  const updateQuantity = async (id, currentQty, direction, unit) => {
    // تحديد مقدار القفزة بناءً على الوحدة
    let step = 1; 
    if (unit === 'جرام' || unit === 'مللي') {
      step = 50;
    }

    const change = direction * step;
    const newQty = currentQty + change;

    if (newQty < 0) return; // منع الكميات السالبة

    await fetch(`/api/ingredients?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQty }),
    });
    fetchIngredients();
  };

  // حذف صنف
  const deleteItem = async (id) => {
    if (confirm("هل تريد حذف هذا المكون نهائياً؟")) {
      await fetch(`/api/ingredients?id=${id}`, { method: 'DELETE' });
      fetchIngredients();
    }
  };

  return (
    <div dir="rtl" style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '450px', margin: '0 auto' }}>
        
        {/* العنوان الرئيسي */}
        <header style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h1 style={{ fontSize: '2.2rem', color: '#111827', margin: 0 }}>مخزن هم النم 🍎</h1>
          <p style={{ color: '#4b5563', marginTop: '5px' }}>تتبع مستلزمات مطبخك بذكاء</p>
        </header>

        {/* كارت إضافة المكونات */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '25px' }}>
          <form onSubmit={addItem} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              placeholder="اسم المكون (مثلاً: لبن، بيض...)" 
              value={newItem.name} 
              onChange={e => setNewItem({...newItem, name: e.target.value})} 
              required 
              style={{ padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '16px', outlineColor: '#10b981' }} 
            />
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                placeholder="الكمية" 
                type="number" 
                value={newItem.quantity} 
                onChange={e => setNewItem({...newItem, quantity: e.target.value})} 
                required 
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', minWidth: '0' }} 
              />
              
              <select 
                value={newItem.unit} 
                onChange={e => setNewItem({...newItem, unit: e.target.value})} 
                required 
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', backgroundColor: 'white', cursor: 'pointer' }}
              >
                <option value="" disabled>اختر الوحدة</option>
                <option value="جرام">جرام</option>
                <option value="قطعة">قطعة</option>
                <option value="مللي">مللي</option>
              </select>
            </div>

            <button type="submit" style={{ backgroundColor: '#10b981', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'background 0.3s' }}>
              إضافة إلى الثلاجة
            </button>
          </form>
        </div>

        {/* عرض قائمة المكونات */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {ingredients.length > 0 ? ingredients.map((item) => (
            <div key={item._id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#1f2937' }}>{item.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                  {/* أزرار التعديل */}
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity, -1, item.unit)} 
                    style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    -
                  </button>
                  
                  <span style={{ fontWeight: '700', color: '#059669', minWidth: '85px', textAlign: 'center', fontSize: '1.1rem' }}>
                    {item.quantity} {item.unit}
                  </span>

                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity, 1, item.unit)} 
                    style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => deleteItem(item._id)} 
                style={{ color: '#f87171', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
              >
                حذف
              </button>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: '#9ca3af', backgroundColor: 'white', borderRadius: '16px' }}>
              <p>لا توجد مكونات حالياً. ابدأ بإضافة مشترياتك!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
