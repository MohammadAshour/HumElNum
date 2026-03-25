'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/suggest');
      const json = await res.json();
      if (json.success) {
        setAllSuggestions(json.data);
      }
    } catch (err) { 
      console.error("Fetch error:", err); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getSuggestions(); }, []);

  const pickRecipe = (type) => {
    // الفلترة بتعتمد على النوع (فطار/غداء/عشاء)
    const filtered = allSuggestions.filter(r => r.type.includes(type));
    
    if (filtered.length > 0) {
      const random = filtered[Math.floor(Math.random() * filtered.length)];
      setCurrentRecipe(random);
      setSelectedType(type);
      setShowDetails(false);
    } else {
      setCurrentRecipe(null);
      setSelectedType(type);
    }
  };

  return (
    <div dir="rtl" style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#fff', minHeight: '100vh', color: '#1e293b' }}>
      
      <header style={{ textAlign: 'center', marginTop: '10px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '0', color: '#1e293b' }}>هم النم 🍎</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>مساعد المطبخ الذكي</p>
      </header>

      {/* أزرار اختيار نوع الوجبة */}
      <section style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
        {['فطار', 'غداء', 'عشاء'].map((t) => (
          <button key={t} onClick={() => pickRecipe(t)}
            style={{
              flex: 1, maxWidth: '95px', padding: '15px 5px', borderRadius: '22px', border: '2px solid',
              cursor: 'pointer', fontWeight: 'bold', transition: '0.3s',
              borderColor: selectedType === t ? '#6366f1' : '#f1f5f9',
              backgroundColor: selectedType === t ? '#6366f1' : '#fff',
              color: selectedType === t ? '#fff' : '#64748b',
            }}>
            <span style={{ fontSize: '1.2rem' }}>{t === 'فطار' ? '🍳' : t === 'غداء' ? '🍗' : '🥪'}</span>
            <br/> {t}
          </button>
        ))}
      </section>

      <main style={{ maxWidth: '420px', margin: '0 auto', textAlign: 'center' }}>
        {loading ? (
          <p style={{ color: '#94a3b8' }}>جاري تحضير المنيو...</p>
        ) : currentRecipe ? (
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '35px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' }}>
            <div style={{ marginBottom: '10px' }}>
               <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '4px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                 اقتراح مخصص ✨
               </span>
            </div>

            <h2 style={{ fontSize: '2.2rem', margin: '10px 0', color: '#0f172a' }}>{currentRecipe.title}</h2>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', color: '#64748b', fontSize: '0.9rem', marginBottom: '25px' }}>
              <span>⏱️ {currentRecipe.cookTime} دقيقة</span>
              <span>📊 {currentRecipe.difficulty}</span>
            </div>

            {showDetails && (
              <div style={{ textAlign: 'right', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '20px', marginBottom: '20px', fontSize: '0.95rem', border: '1px solid #edf2f7' }}>
                <p style={{ fontWeight: 'bold', color: '#6366f1', marginBottom: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>🛒 المقادير المطلوبة:</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 15px 0' }}>
                  {currentRecipe.ingredients.map((ing, idx) => (
                    <li key={idx} style={{ marginBottom: '5px', display: 'flex', gap: '5px' }}>
                      <span>•</span>
                      <span>{ing.value} {ing.unit} <b>{ing.name}</b></span>
                    </li>
                  ))}
                </ul>
                
                <p style={{ fontWeight: 'bold', color: '#6366f1', marginBottom: '5px', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>👨‍🍳 طريقة التحضير:</p>
                <p style={{ lineHeight: '1.6', color: '#475569', whiteSpace: 'pre-line' }}>{currentRecipe.instructions}</p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => setShowDetails(!showDetails)} 
                style={{ padding: '16px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '18px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
                {showDetails ? 'إخفاء التفاصيل' : 'يلا بينا (التفاصيل)'}
              </button>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => alert('تم التسجيل! بالهنا والشفا')} 
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
        ) : selectedType ? (
          <div style={{ padding: '40px', border: '2px dashed #e2e8f0', borderRadius: '30px' }}>
             <p style={{ color: '#94a3b8' }}>مفيش أكلات مسجلة للـ {selectedType} لسه.</p>
             <Link href="/chef" style={{ color: '#6366f1', fontWeight: 'bold', textDecoration: 'none', display: 'block', marginTop: '10px' }}>روحي ضيفي أكلة جديدة 👨‍🍳</Link>
          </div>
        ) : (
          <div style={{ marginTop: '50px', color: '#cbd5e1' }}>
            <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🥣</div>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#94a3b8' }}>جعانين إيه النهاردة؟</p>
            <p style={{ fontSize: '0.9rem' }}>اختار نوع الوجبة من فوق وهقترحلك أكلة</p>
          </div>
        )}
      </main>

      <footer style={{ marginTop: '60px', borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', justifyContent: 'center', gap: '40px' }}>
        <Link href="/store" style={{ textDecoration: 'none', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 'bold' }}>📦 المخزن</Link>
        <Link href="/chef" style={{ textDecoration: 'none', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 'bold' }}>👨‍🍳 الشيف</Link>
      </footer>
    </div>
  );
}
