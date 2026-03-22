'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/suggest');
      const json = await res.json();
      if (json.success) {
        setAllSuggestions(json.data);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { getSuggestions(); }, []);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    // الفلترة بتشوف لو النوع المختار موجود جوه مصفوفة الـ type بتاعة الأكلة
    const filtered = allSuggestions.filter(recipe => recipe.type.includes(type));
    setFilteredSuggestions(filtered);
  };

  return (
    <div dir="rtl" style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#fff', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', margin: '30px 0' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b' }}>هم النم 🍎</h1>
        <p style={{ color: '#64748b' }}>تاكلوا إيه النهاردة؟</p>
      </header>

      <section style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px' }}>
        {['فطار', 'غداء', 'عشاء'].map((t) => (
          <button key={t} onClick={() => handleTypeSelect(t)}
            style={{
              flex: 1, maxWidth: '90px', padding: '15px 5px', borderRadius: '20px', border: '2px solid',
              transition: '0.3s', cursor: 'pointer', fontWeight: 'bold',
              borderColor: selectedType === t ? '#6366f1' : '#f1f5f9',
              backgroundColor: selectedType === t ? '#6366f1' : '#fff',
              color: selectedType === t ? '#fff' : '#64748b',
            }}>
            {t === 'فطار' ? '🍳' : t === 'غداء' ? '🍗' : '🥪'} <br/> {t}
          </button>
        ))}
      </section>

      <main style={{ maxWidth: '500px', margin: '0 auto' }}>
        {selectedType ? (
          <>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>مقترحات الـ {selectedType}:</h2>
            {filteredSuggestions.length > 0 ? (
              <div style={{ display: 'grid', gap: '15px' }}>
                {filteredSuggestions.map(recipe => (
                  <div key={recipe._id} style={{ padding: '20px', borderRadius: '25px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0' }}>{recipe.title}</h3>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>⏱️ {recipe.cookTime} دقيقة | {recipe.difficulty}</div>
                    <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#475569' }}><b>الطريقة:</b> {recipe.instructions}</p>
                  </div>
                ))}
              </div>
            ) : <p style={{ textAlign: 'center', color: '#cbd5e1' }}>مفيش وصفات {selectedType} كاملة المكونات حالياً.</p>}
          </>
        ) : <p style={{ textAlign: 'center', color: '#cbd5e1' }}>اختار نوع الوجبة عشان نشغل المطبخ!</p>}
      </main>

      <footer style={{ marginTop: '50px', borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', justifyContent: 'center', gap: '30px' }}>
        <Link href="/store" style={{ textDecoration: 'none', color: '#64748b' }}>📦 المخزن</Link>
        <Link href="/chef" style={{ textDecoration: 'none', color: '#64748b' }}>👨‍🍳 الشيف</Link>
      </footer>
    </div>
  );
}
