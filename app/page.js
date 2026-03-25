'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  // دالة جلب اقتراح عشوائي من السيرفر
  const pickRecipe = async (type) => {
    setLoading(true);
    setSelectedType(type);
    
    // إرسال الـ ID الحالي (إن وجد) لاستبعاده من الاقتراح القادم
    const excludeParam = currentRecipe ? `&exclude=${currentRecipe._id}` : '';
    
    try {
      const res = await fetch(`/api/suggest?type=${type}${excludeParam}`);
      const json = await res.json();
      
      if (json.success) {
        if (json.data) {
          setCurrentRecipe(json.data);
          setShowDetails(false); // إغلاق التفاصيل عند تغيير الأكلة
        } else {
          // لو مفيش غير أكلة واحدة بس في النوع ده في الداتا بيز
          alert(`مفيش غير "${currentRecipe?.title}" حالياً في قسم الـ ${type}`);
        }
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#fff', minHeight: '100vh', color: '#1e293b' }}>
      
      {/* الهيدر */}
      <header style={{ textAlign: 'center', marginTop: '10px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '900', margin: '0', color: '#1e293b' }}>هم النم 🍎</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '5px' }}>مساعد مطبخ مامت يوسف الذكي</p>
      </header>

      {/* أزرار اختيار نوع الوجبة */}
      <section style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '35px' }}>
        {['فطار', 'غداء', 'عشاء'].map((t) => (
          <button key={t} onClick={() => pickRecipe(t)}
            style={{
              flex: 1, maxWidth: '100px', padding: '18px 5px', borderRadius: '25px', border: '2px solid',
              cursor: 'pointer', fontWeight: 'bold', transition: '0.3s',
              borderColor: selectedType === t ? '#6366f1' : '#f1f5f9',
              backgroundColor: selectedType === t ? '#6366f1' : '#fff',
              color: selectedType === t ? '#fff' : '#64748b',
              boxShadow: selectedType === t ? '0 10px 15px -3px rgba(99, 102, 241, 0.3)' : 'none'
            }}>
            <span style={{ fontSize: '1.4rem' }}>{t === 'فطار' ? '🍳' : t === 'غداء' ? '🍗' : '🥪'}</span>
            <br/> {t}
          </button>
        ))}
      </section>

      <main style={{ maxWidth: '420px', margin: '0 auto', textAlign: 'center' }}>
        {loading ? (
          <div style={{ padding: '50px', color: '#6366f1', fontWeight: 'bold' }}>
            <div className="spinner" style={{ marginBottom: '10px' }}>⏳</div>
            بفكرلك في أكلة حلوة...
          </div>
        ) : currentRecipe ? (
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '35px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
            
            <div style={{ marginBottom: '10px' }}>
               <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '5px 15px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                 اقتراح اليوم ✨
               </span>
            </div>

            <h2 style={{ fontSize: '2.4rem', margin: '15px 0', color: '#0f172a', fontWeight: '800' }}>{currentRecipe.title}</h2>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', color: '#64748b', fontSize: '0.95rem', marginBottom: '30px' }}>
              <span>⏱️ {currentRecipe.cookTime} دقيقة</span>
              <span style={{ color: currentRecipe.difficulty === 'صعب' ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                📊 {currentRecipe.difficulty}
              </span>
            </div>

            {/* تفاصيل الوصفة والمقادير */}
            {showDetails && (
              <div style={{ textAlign: 'right', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '25px', marginBottom: '25px', border: '1px solid #edf2f7', animation: 'fadeIn 0.3s' }}>
                <p style={{ fontWeight: 'bold', color: '#6366f1', marginBottom: '12px', fontSize: '1rem', borderBottom: '2px solid #eef2ff', paddingBottom: '5px' }}>🛒 المقادير:</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
                  {currentRecipe.ingredients && currentRecipe.ingredients.map((ing, idx) => (
                    <li key={idx} style={{ marginBottom: '8px', fontSize: '0.95rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: '#10b981' }}>✔</span>
                      <span>{ing.value} {ing.unit} <b>{ing.name}</b></span>
                    </li>
                  ))}
                </ul>
                
                <p style={{ fontWeight: 'bold', color: '#6366f1', marginBottom: '8px', fontSize: '1rem', borderBottom: '2px solid #eef2ff', paddingBottom: '5px' }}>👨‍🍳 الطريقة:</p>
                <p style={{ lineHeight: '1.7', color: '#475569', whiteSpace: 'pre-line', fontSize: '0.9rem' }}>{currentRecipe.instructions}</p>
              </div>
            )}

            {/* أزرار التحكم */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <button onClick={() => setShowDetails(!showDetails)} 
                style={{ padding: '18px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: '0.2s' }}>
                {showDetails ? 'إخفاء التفاصيل 🔼' : 'يلا بينا (التفاصيل) 👇'}
              </button>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => alert(`بالهنا والشفا! مريم ويوسف هيحبوا الـ ${currentRecipe.title} جداً`)} 
                  style={{ flex: 1, padding: '15px', backgroundColor: '#fff', color: '#10b981', border: '2px solid #10b981', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
                   كلناها ✅
                </button>
                <button onClick={() => pickRecipe(selectedType)} 
                  style={{ flex: 1, padding: '15px', backgroundColor: '#fff', color: '#f87171', border: '2px solid #f87171', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
                   شوف غيره 🔄
                </button>
              </div>
            </div>
          </div>
        ) : selectedType ? (
          <div style={{ padding: '50px 20px', border: '2px dashed #e2e8f0', borderRadius: '35px', backgroundColor: '#fcfcfc' }}>
             <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>كتاب الوصفات فاضي في قسم الـ {selectedType}..</p>
             <Link href="/chef" style={{ color: '#6366f1', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', marginTop: '15px', padding: '10px 20px', backgroundColor: '#eef2ff', borderRadius: '12px' }}>روحي ضيفي أكلة 👨‍🍳</Link>
          </div>
        ) : (
          <div style={{ marginTop: '60px', color: '#cbd5e1' }}>
            <div style={{ fontSize: '5rem', marginBottom: '20px', opacity: '0.6' }}>🥗</div>
            <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#94a3b8' }}>جاهزين نطبخ إيه؟</p>
            <p style={{ fontSize: '0.9rem' }}>اختار نوع الوجبة من فوق وهطلعلك اقتراح عشوائي</p>
          </div>
        )}
      </main>

      {/* فوتر التنقل السفلي */}
      <footer style={{ marginTop: '80px', borderTop: '1px solid #f1f5f9', paddingTop: '25px', display: 'flex', justifyContent: 'center', gap: '50px' }}>
        <Link href="/store" style={{ textDecoration: 'none', color: '#94a3b8', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '1.5rem' }}>📦</span> المخزن
        </Link>
        <Link href="/chef" style={{ textDecoration: 'none', color: '#94a3b8', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '1.5rem' }}>👨‍🍳</span> الشيف
        </Link>
      </footer>

      {/* CSS بسيط للأنيميشن */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
