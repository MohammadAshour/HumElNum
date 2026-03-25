'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  // دالة الاقتراح الموحدة (للاقتراح العادي أو لتسجيل الأكل)
  const pickRecipe = async (type, isMarkEaten = false) => {
    setLoading(true);
    setSelectedType(type);
    
    const actionParam = isMarkEaten ? `&action=markEaten` : '';
    const excludeParam = currentRecipe ? `&exclude=${currentRecipe._id}` : '';
    
    try {
      const res = await fetch(`/api/suggest?type=${type}${excludeParam}${actionParam}`);
      const json = await res.json();
      
      if (json.success) {
        if (json.data) {
          setCurrentRecipe(json.data);
          setShowDetails(false);
        } else {
          if (isMarkEaten) {
            alert(`تم التسجيل، ولكن لا توجد أكلات أخرى متاحة حالياً في قسم ${type}`);
            setCurrentRecipe(null);
          } else {
            alert(`لا توجد أكلات مسجلة في قسم ${type}`);
          }
        }
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // دالة إعادة تعيين كافة التواريخ
  const resetAllEatenDates = async () => {
    if (!confirm("هل تريد مسح تاريخ آخر أكلة لجميع الوجبات؟")) return;
    
    try {
      const res = await fetch('/api/recipes/reset', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        alert("تمت إعادة التعيين بنجاح");
        setCurrentRecipe(null);
        setSelectedType(null);
      }
    } catch (err) {
      console.error("Reset Error:", err);
    }
  };

  return (
    <div dir="rtl" style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#fff', minHeight: '100vh', color: '#1e293b' }}>
      
      <header style={{ textAlign: 'center', marginTop: '10px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '0' }}>هم النم 🍎</h1>
      </header>

      {/* أزرار اختيار نوع الوجبة */}
      <section style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
        {['فطار', 'غداء', 'عشاء'].map((t) => (
          <button key={t} onClick={() => pickRecipe(t)}
            style={{
              flex: 1, maxWidth: '95px', padding: '15px 5px', borderRadius: '20px', border: '2px solid',
              cursor: 'pointer', fontWeight: 'bold',
              borderColor: selectedType === t ? '#6366f1' : '#f1f5f9',
              backgroundColor: selectedType === t ? '#6366f1' : '#fff',
              color: selectedType === t ? '#fff' : '#64748b',
            }}>
            {t === 'فطار' ? '🍳' : t === 'غداء' ? '🍗' : '🥪'} <br/> {t}
          </button>
        ))}
      </section>

      <main style={{ maxWidth: '420px', margin: '0 auto', textAlign: 'center' }}>
        {loading ? (
          <p style={{ color: '#94a3b8' }}>جاري التحميل...</p>
        ) : currentRecipe ? (
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '35px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
            
            <h2 style={{ fontSize: '2.2rem', margin: '0 0 10px 0', color: '#0f172a' }}>{currentRecipe.title}</h2>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', color: '#64748b', fontSize: '0.9rem', marginBottom: '25px' }}>
              <span>⏱️ {currentRecipe.cookTime} دقيقة</span>
              <span style={{ fontWeight: 'bold' }}>📊 {currentRecipe.difficulty}</span>
            </div>

            {showDetails && (
              <div style={{ textAlign: 'right', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '20px', marginBottom: '20px', fontSize: '0.95rem' }}>
                <p style={{ fontWeight: 'bold', color: '#6366f1', marginBottom: '10px' }}>المقادير:</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 15px 0' }}>
                  {currentRecipe.ingredients && currentRecipe.ingredients.map((ing, idx) => (
                    <li key={idx} style={{ marginBottom: '5px' }}>
                      • {ing.value} {ing.unit} <b>{ing.name}</b>
                    </li>
                  ))}
                </ul>
                <p style={{ fontWeight: 'bold', color: '#6366f1', marginBottom: '5px' }}>الطريقة:</p>
                <p style={{ lineHeight: '1.6', color: '#475569', whiteSpace: 'pre-line' }}>{currentRecipe.instructions}</p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => setShowDetails(!showDetails)} 
                style={{ padding: '16px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '18px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
                {showDetails ? 'إخفاء التفاصيل' : 'يلا بينا (التفاصيل)'}
              </button>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => pickRecipe(selectedType, true)} 
                  style={{ flex: 1, padding: '12px', backgroundColor: '#fff', color: '#10b981', border: '2px solid #10b981', borderRadius: '18px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
                   كلناها ✅
                </button>
                <button onClick={() => pickRecipe(selectedType)} 
                  style={{ flex: 1, padding: '12px', backgroundColor: '#fff', color: '#f87171', border: '2px solid #f87171', borderRadius: '18px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
                   شوف غيره 🔄
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '50px', color: '#cbd5e1' }}>
            <p style={{ fontSize: '1.2rem' }}>اختار نوع الوجبة للبدء</p>
          </div>
        )}

        {/* زرار الريسيت */}
        <button 
          onClick={resetAllEatenDates}
          style={{
            marginTop: '40px',
            padding: '8px 15px',
            backgroundColor: '#fff',
            color: '#cbd5e1',
            border: '1px solid #f1f5f9',
            borderRadius: '10px',
            fontSize: '0.7rem',
            cursor: 'pointer'
          }}
        >
          إعادة تعيين ذاكرة الأكل 🔄
        </button>
      </main>

      <footer style={{ marginTop: '40px', borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', justifyContent: 'center', gap: '40px' }}>
        <Link href="/store" style={{ textDecoration: 'none', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 'bold' }}>📦 المخزن</Link>
        <Link href="/chef" style={{ textDecoration: 'none', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 'bold' }}>👨‍🍳 الشيف</Link>
      </footer>
    </div>
  );
}
