'use client';
import { useState } from 'react';
import { STORES, CATEGORIES } from '../lib/config';

function Counter({ value, onChange, color }: { value: number, onChange: (v: number) => void, color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: color || '#f3f4f6', borderRadius: 8, padding: '4px 6px', minWidth: 80 }}>
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#1A2A3A', padding: '8px 10px', minWidth: 44, minHeight: 44, touchAction: 'manipulation' }}>−</button>
      <input
        type="number"
        value={value}
        onChange={e => onChange(Math.max(0, parseInt(e.target.value) || 0))}
        style={{ width: 40, textAlign: 'center', fontSize: 18, fontWeight: 800, border: 'none', background: 'transparent', WebkitAppearance: 'none', color: '#1A2A3A' }}
      />
      <button
        onClick={() => onChange(value + 1)}
        style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#1A2A3A', padding: '8px 10px', minWidth: 44, minHeight: 44, touchAction: 'manipulation' }}>+</button>
    </div>
  );
}

export default function Home() {
  const [store, setStore] = useState('');
  const [orders, setOrders] = useState<Record<string, number>>({});
  const [onHand, setOnHand] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const setOrderQty = (item: string, val: number) => setOrders(o => ({ ...o, [item]: val }));
  const setOnHandQty = (item: string, val: number) => setOnHand(o => ({ ...o, [item]: val }));

  const handleSubmit = async () => {
    if (!store) { alert('Please select your store first!'); return; }
    const hasItems = Object.values(orders).some(qty => qty > 0);
    if (!hasItems) { alert('Please order at least one item!'); return; }

    setLoading(true);
    try {
      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store, orders, onHand }),
      });
      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        alert('Something went wrong: ' + result.error);
      }
    } catch (error: any) {
      alert('Submission failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h2 style={{ color: '#048A81', marginBottom: 8 }}>Order Submitted!</h2>
        <p style={{ color: '#666', marginBottom: 24 }}>{store} — Order Submitted</p>
        <button onClick={() => { setSubmitted(false); setOrders({}); setOnHand({}); setStore(''); }}
          style={{ background: '#048A81', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontSize: 15, cursor: 'pointer' }}>
          New Order
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 0 80px', fontFamily: 'system-ui, sans-serif' }}>

      {/* DEBUG - remove after testing */}
      {/* Header */}
      <div style={{ background: '#1A2A3A', padding: '16px 20px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/lucys_logo.png" alt="Lucy's" style={{ height: 36, width: 36, objectFit: 'contain' }} />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>CK Inventory</span>
          </div>
          <span style={{ background: '#048A81', color: '#fff', fontSize: 11, padding: '3px 10px', borderRadius: 20 }}>
            Today
          </span>
        </div>
        <select key={store} value={store} onChange={e => setStore(e.target.value)}
          style={{ marginTop: 10, width: '100%', padding: '8px 12px', borderRadius: 8, border: 'none', fontSize: 14, background: store ? '#048A81' : '#2E4057', color: store ? '#fff' : '#aaa' }}>
          <option value="">— Select your store —</option>
          {STORES.map((s: string) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Categories */}
      {CATEGORIES.map((cat: any, ci: number) => (
        <div key={ci}>
          <div style={{ background: '#2E4057', padding: '8px 20px' }}>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{cat.name}</span>
          </div>
          {cat.items.map((item: string, ii: number) => (
            <div key={ii} style={{ padding: '10px 20px', background: ii % 2 === 0 ? '#f9fafb' : '#fff', borderBottom: '0.5px solid #eee' }}>
              <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 500, color: '#1A2A3A' }}>{item}</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {cat.hasOnHand && (
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 4px', fontSize: 10, color: '#888' }}>On Hand</p>
                    <Counter value={onHand[item] || 0} onChange={v => setOnHandQty(item, v)} color="#f3f4f6" />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px', fontSize: 10, color: '#888' }}>Order Qty</p>
                  <Counter value={orders[item] || 0} onChange={v => setOrderQty(item, v)} color="#e6f7f4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Submit button */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 20px', background: '#fff', borderTop: '0.5px solid #eee' }}>
        <button onClick={handleSubmit} disabled={loading}
          style={{ width: '100%', background: loading ? '#888' : '#048A81', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Submitting...' : `Submit Order — ${store || 'Select Store'}`}
        </button>
      </div>
    </div>
  );
}