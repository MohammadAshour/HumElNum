'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/suggest');
      const json = await res.json();
      if (json.success) setAllSuggestions(json.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { getSuggestions(); }, []);

  // اختيار أكلة عشوائية بناءً على النوع
  const pickRecipe = (type) => {
    const filtered = allSuggestions.filter(r => r.type.includes(type));
    if (filtered.length > 0) {
      const random = filtered[Math.floor(Math.random() * filtered.length)];
      setCurrentRecipe(random);
      setSelectedType(type);
      setShowDetails(false); // إخفاء التفاصيل عند تغيير الاقتراح
    } else {
      setCurrentRecipe(null);
      setSelectedType(type);
    }
  };

  const markAsEaten = async () => {
    if (!currentRecipe) return;
    // هنا ممكن مستقبلاً نربط API يقلل المكونات من المخزن
    alert(`بالهنا والشفا! تم تسجيل إنكم أكلتم ${currentRecipe.title}`);
    // نسحب اقتراح جديد بعد الأكل
    pickRecipe(selectedType);
  };

  return (
    <div dir="rtl" style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#fff', minHeight: '100vh', color: '#1e293b' }}>
      
      <header style={{ textAlign: 'center', marginTop: '10px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '0' }}>هم النم 🍎</h1>
      </header>

      {/* اختيارات الوجبة */}
      <section style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
        {['فطار', 'غداء', 'عشاء'].map((t) => (
          <button key={t} onClick={() => pickRecipe(t)}
            style={{
              flex: 1, maxWidth: '90px', padding: '15px 5px', borderRadius: '20px', border: '2px solid',
              cursor: 'pointer', fontWeight: 'bold',
              borderColor: selectedType === t ? '#6366f1' : '#f1f5f9',
              backgroundColor: selectedType === t ? '#6366f1' : '#fff',
              color: selectedType === t ? '#fff' : '#64748b',
            }}>
            {t === 'فطار' ? '🍳' : t === 'غداء' ? '🍗' : '🥪'} <br/> {t}
          </button>
        ))}
      </section>

      <main style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
        {currentRecipe ? (
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '30px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9' }}>
            <span style={{ backgroundColor: '#eef2ff', color: '#6366f1', padding: '5px 15px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>اقتراح الشيف ليك:</span>
            <h2 style={{ fontSize: '2rem', margin: '15px 0 10px 0' }}>{currentRecipe.title}</h2>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', color: '#64748b', fontSize: '0.9rem', marginBottom: '25px' }}>
              <span>⏱️ {currentRecipe.cookTime} دقيقة</span>
              <span>📊 {currentRecipe.difficulty}</span>
            </div>

            {showDetails && (
              <div style={{ textAlign: 'right', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '15px', marginBottom: '20px', fontSize: '0.9rem', lineHeight: '1.6' }}>
                <p><b>الطريقة:</b> {currentRecipe.instructions}</p>
                <p><b>المكونات:</b> {currentRecipe.ingredients.join('، ')}</p>
              </div>
            )}

            {/* أزرار التحكم */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => setShowDetails(!showDetails)} style={{ padding: '15px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
                {showDetails ? 'إخفاء التفاصيل' : 'يلا بينا (التفاصيل)'}
              </button>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={markAsEaten} style={{ flex: 1, padding: '12px', backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #10b981', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
                   كلناها قريب ✅
                </button>
                <button onClick={() => pickRecipe(selectedType)} style={{ flex: 1, padding: '12px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #f87171', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
                   شوف غيره 🔄
                </button>
              </div>
            </div>
          </div>
        ) : selectedType ? (
          <p style={{ color: '#94a3b8' }}>مفيش أكلات متاحة حالياً للـ {selectedType}.</p>
        ) : (
          <div style={{ marginTop: '50px', color: '#cbd5e1' }}>
            <p style={{ fontSize: '1.2rem' }}>جاهزين نطبخ؟ 👨‍🍳</p>
            <p>اختار نوع الوجبة عشان أقولك نأكل إيه</p>
          </div>
        )}
      </main>

      <footer style={{ marginTop: '60px', borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', justifyContent: 'center', gap: '30px' }}>
        <Link href="/store" style={{ textDecoration: 'none', color: '#94a3b8', fontSize: '0.8rem' }}>📦 المخزن</Link>
        <Link href="/chef" style={{ textDecoration: 'none', color: '#94a3b8', fontSize: '0.8rem' }}>👨‍🍳 الشيف</Link>
      </footer>
    </div>
  );
}
