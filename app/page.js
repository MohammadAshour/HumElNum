'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/suggest');
      const json = await res.json();
      if (json.success) setSuggestions(json.data);
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  useEffect(() => { getSuggestions(); }, []);

  return (
    <div dir="rtl" style={{ padding: '15px', fontFamily: 'Arial', backgroundColor: '#fdfdfd', minHeight: '100vh' }}>
      
      {/* Header مع لمسة جمالية */}
      <header style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '20px' }}>
        <h1 style={{ fontSize: '2.8rem', color: '#1e293b', margin: '0' }}>هم النم 🍎</h1>
        <div style={{ height: '4px', width: '60px', backgroundColor: '#6366f1', margin: '10px auto', borderRadius: '2px' }}></div>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>منيو النهاردة حسب المتاح في بيتك</p>
      </header>

      {/* زراير التحكم الجديدة */}
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
        <Link href="/store" style={{ textDecoration: 'none' }}>
          <div style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            padding: '20px', backgroundColor: '#ecfdf5', borderRadius: '15px', 
            border: '2px solid #10b981', color: '#065f46', cursor: 'pointer', width: '100px'
          }}>
            <span style={{ fontSize: '2rem' }}>📦</span>
            <b style={{ fontSize: '0.9rem' }}>المخزن</b>
          </div>
        </Link>

        <Link href="/chef" style={{ textDecoration: 'none' }}>
          <div style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            padding: '20px', backgroundColor: '#eef2ff', borderRadius: '15px', 
            border: '2px solid #6366f1', color: '#3730a3', cursor: 'pointer', width: '100px'
          }}>
            <span style={{ fontSize: '2rem' }}>👨‍🍳</span>
            <b style={{ fontSize: '0.9rem' }}>الشيف</b>
          </div>
        </Link>
      </nav>

      {/* قسم الاقتراحات */}
      <section style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 5px' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#334155' }}>مقترحات الشيف:</h2>
          <button onClick={getSuggestions} style={{ color: '#6366f1', border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            🔄 تحديث
          </button>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div style={{ fontSize: '1.5rem' }}>⌛</div>
            <p>بنشوف إيه اللي ناقص في المخزن...</p>
          </div>
        ) : suggestions.length > 0 ? (
          <div style={{ display: 'grid', gap: '15px' }}>
            {suggestions.map(recipe => (
              <div key={recipe._id} style={{ 
                backgroundColor: 'white', borderRadius: '18px', padding: '20px', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ margin: '0', color: '#1e293b' }}>{recipe.title}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: 'bold' }}>{recipe.type}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '5px' }}>
                  ⏱️ {recipe.cookTime} دقيقة | 📊 {recipe.difficulty}
                </div>
                <div style={{ marginTop: '12px', fontSize: '0.9rem', color: '#475569' }}>
                  <b>المكونات:</b> {recipe.ingredients.join('، ')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '20px' }}>
            <p>المخزن محتاج يتملي شوية عشان الشيف يقدر يقترح أكلات كاملة!</p>
          </div>
        )}
      </section>
    </div>
  );
}
