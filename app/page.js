'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedType, setSelectedType] = useState(null); // فطار، غداء، عشاء
  const [loading, setLoading] = useState(false);

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/suggest');
      const json = await res.json();
      if (json.success) {
        setAllSuggestions(json.data);
        // لو مفيش نوع مختار، نعرض كله مؤقتاً أو نسيبها فاضية لحد ما يختار
        setFilteredSuggestions(json.data);
      }
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  useEffect(() => { getSuggestions(); }, []);

  // دالة الفلترة حسب الوجبة
  const handleTypeSelect = (type) => {
    setSelectedType(type);
    const filtered = allSuggestions.filter(recipe => recipe.type === type);
    setFilteredSuggestions(filtered);
  };

  return (
    <div dir="rtl" style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#fff', minHeight: '100vh', color: '#1e293b' }}>
      
      {/* الجزء العلوي: هادي وبسيط */}
      <header style={{ textAlign: 'center', marginTop: '20px', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '5px' }}>هم النم 🍎</h1>
        <p style={{ color: '#64748b' }}>أهلاً يا حسن.. تحب تاكل إيه دلوقتي؟</p>
      </header>

      {/* اختيارات الوجبة: هي دي "نجمة" الصفحة */}
      <section style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px' }}>
        {['فطار', 'غداء', 'عشاء'].map((type) => (
          <button
            key={type}
            onClick={() => handleTypeSelect(type)}
            style={{
              flex: 1, maxWidth: '100px', padding: '15px 10px', borderRadius: '20px',
              border: '2px solid', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer',
              transition: '0.3s',
              borderColor: selectedType === type ? '#6366f1' : '#f1f5f9',
              backgroundColor: selectedType === type ? '#6366f1' : '#fff',
              color: selectedType === type ? '#fff' : '#64748b',
              boxShadow: selectedType === type ? '0 10px 15px -3px rgba(99, 102, 241, 0.3)' : 'none'
            }}
          >
            {type === 'فطار' ? '🍳' : type === 'غداء' ? '🍗' : '🥪'} <br/> {type}
          </button>
        ))}
      </section>

      {/* قسم الاقتراحات الذكي */}
      <main style={{ maxWidth: '500px', margin: '0 auto', minHeight: '300px' }}>
        {selectedType ? (
          <>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
               مقترحات الـ {selectedType}:
            </h2>
            {loading ? (
              <p style={{ textAlign: 'center' }}>بنشوف المتاح في المخزن...</p>
            ) : filteredSuggestions.length > 0 ? (
              <div style={{ display: 'grid', gap: '15px' }}>
                {filteredSuggestions.map(recipe => (
                  <div key={recipe._id} style={{ 
                    backgroundColor: '#fff', borderRadius: '25px', padding: '20px', 
                    border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                  }}>
                    <h3 style={{ margin: '0', fontSize: '1.2rem' }}>{recipe.title}</h3>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '5px' }}>
                      ⏱️ {recipe.cookTime} دقيقة | 📊 مستوى {recipe.difficulty}
                    </div>
                    <p style={{ marginTop: '12px', fontSize: '0.9rem', color: '#475569', lineHeight: '1.6' }}>
                      <b>الطريقة:</b> {recipe.instructions}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                <p>للأسف مفيش أكلة {selectedType} كاملة المكونات حالياً.</p>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '20px', color: '#cbd5e1' }}>
             اختاري وجبة عشان تشوفي الاقتراحات..
          </div>
        )}
      </main>

      {/* أدوات المطبخ: في الآخر وبشكل بسيط (Secondary Buttons) */}
      <footer style={{ marginTop: '60px', borderTop: '1px solid #f1f5f9', paddingTop: '30px', paddingBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <Link href="/store" style={{ textDecoration: 'none', color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
            📦 المخزن
          </Link>
          <div style={{ width: '1px', height: '20px', backgroundColor: '#e2e8f0' }}></div>
          <Link href="/chef" style={{ textDecoration: 'none', color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
            👨‍🍳 الشيف
          </Link>
        </div>
      </footer>
    </div>
  );
}
