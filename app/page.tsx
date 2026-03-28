'use client';
import { useState } from 'react';
import { STORES, CATEGORIES } from '../lib/config';

function Counter({ value, onChange, color }: { value: number, onChange: (v: number) => void, color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: color || '#f3f4f6', borderRadius: 8, width: 100 }}>
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#1A2A3A', padding: '8px', minWidth: 32, minHeight: 40, touchAction: 'manipulation' }}>−</button>
      <input
        type="number"
        value={value}
        onChange={e => onChange(Math.max(0, parseInt(e.target.value) || 0))}
        style={{ width: 28, textAlign: 'center', fontSize: 16, fontWeight: 800, border: 'none', background: 'transparent', WebkitAppearance: 'none', color: '#1A2A3A' }}
      />
      <button
        onClick={() => onChange(value + 1)}
        style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#1A2A3A', padding: '8px', minWidth: 32, minHeight: 40, touchAction: 'manipulation' }}>+</button>
    </div>
  );
}

// ── Review Screen ─────────────────────────────────────────────
function ReviewScreen({ store, orders, onHand, deliveryDateStr, onBack, onConfirm, loading }: {
  store: string, orders: Record<string, number>, onHand: Record<string, number>,
  deliveryDateStr: string, onBack: () => void, onConfirm: () => void, loading: boolean
}) {
  const orderedItems = CATEGORIES.flatMap((cat: any) =>
    cat.items
      .filter((item: string) => (orders[item] || 0) > 0)
      .map((item: string) => ({ cat: cat.name, item, qty: orders[item], onHand: onHand[item] || 0, hasOnHand: cat.hasOnHand }))
  );
  const totalItems = orderedItems.reduce((sum, i) => sum + i.qty, 0);
  const grouped: Record<string, typeof orderedItems> = {};
  orderedItems.forEach(i => { if (!grouped[i.cat]) grouped[i.cat] = []; grouped[i.cat].push(i); });

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 0 120px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#1A2A3A', padding: '16px 20px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <img src="/lucys_logo.png" alt="Lucy's" style={{ height: 32, width: 32, objectFit: 'contain' }} />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Order Review</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#FFDD00', fontWeight: 700, fontSize: 14 }}>{store}</span>
          <span style={{ background: '#048A81', color: '#fff', fontSize: 11, padding: '3px 10px', borderRadius: 20 }}>
            Delivery: {deliveryDateStr}
          </span>
        </div>
      </div>

      <div style={{ background: '#FFF8E1', borderLeft: '4px solid #F4A261', padding: '12px 20px' }}>
        <p style={{ margin: 0, fontSize: 13, color: '#7C5C2E', fontWeight: 600 }}>⚠️ Please review your order carefully before confirming.</p>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9C7040' }}>{totalItems} item{totalItems !== 1 ? 's' : ''} across {Object.keys(grouped).length} categor{Object.keys(grouped).length !== 1 ? 'ies' : 'y'}</p>
      </div>

      {Object.entries(grouped).map(([catName, items]) => (
        <div key={catName}>
          <div style={{ background: '#2E4057', padding: '8px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{catName}</span>
            {items[0].hasOnHand && (
              <div style={{ display: 'flex', gap: 24 }}>
                <span style={{ color: '#aaa', fontSize: 10 }}>On Hand</span>
                <span style={{ color: '#aaa', fontSize: 10 }}>Order Qty</span>
              </div>
            )}
          </div>
          {items.map((item, idx) => (
            <div key={item.item} style={{ padding: '10px 20px', background: idx % 2 === 0 ? '#f9fafb' : '#fff', borderBottom: '0.5px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#1A2A3A', flex: 1 }}>{item.item}</p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {item.hasOnHand && (
                  <div style={{ background: '#f3f4f6', borderRadius: 20, padding: '4px 14px', fontWeight: 700, fontSize: 15, minWidth: 40, textAlign: 'center', color: '#666' }}>
                    {item.onHand}
                  </div>
                )}
                <div style={{ background: '#048A81', color: '#fff', borderRadius: 20, padding: '4px 14px', fontWeight: 800, fontSize: 16, minWidth: 40, textAlign: 'center' }}>
                  {item.qty}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {orderedItems.length === 0 && (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#888' }}>
          <p style={{ fontSize: 32, margin: '0 0 8px' }}>🛒</p>
          <p style={{ margin: 0, fontSize: 14 }}>No items selected</p>
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 20px', background: '#fff', borderTop: '0.5px solid #eee', display: 'flex', gap: 10 }}>
        <button onClick={onBack} style={{ flex: 1, background: '#f3f4f6', color: '#1A2A3A', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          ← Back to Edit
        </button>
        <button onClick={onConfirm} disabled={loading || orderedItems.length === 0}
          style={{ flex: 2, background: loading || orderedItems.length === 0 ? '#888' : '#048A81', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 600, cursor: loading || orderedItems.length === 0 ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Submitting...' : '✅ Confirm & Submit'}
        </button>
      </div>
    </div>
  );
}

// ── Success Screen ────────────────────────────────────────────
function SuccessScreen({ store, orders, onHand, deliveryDateStr, onNewOrder }: {
  store: string, orders: Record<string, number>, onHand: Record<string, number>,
  deliveryDateStr: string, onNewOrder: () => void
}) {
  const orderedItems = CATEGORIES.flatMap((cat: any) =>
    cat.items
      .filter((item: string) => (orders[item] || 0) > 0)
      .map((item: string) => ({ cat: cat.name, item, qty: orders[item], onHand: onHand[item] || 0, hasOnHand: cat.hasOnHand }))
  );
  const totalItems = orderedItems.reduce((sum, i) => sum + i.qty, 0);
  const grouped: Record<string, typeof orderedItems> = {};
  orderedItems.forEach(i => { if (!grouped[i.cat]) grouped[i.cat] = []; grouped[i.cat].push(i); });

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 0 100px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#048A81', padding: '28px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>✅</div>
        <h2 style={{ color: '#fff', margin: '0 0 4px', fontSize: 20, fontWeight: 700 }}>Order Submitted!</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: 13 }}>{store} · Delivery: {deliveryDateStr}</p>
        <p style={{ color: 'rgba(255,255,255,0.7)', margin: '4px 0 0', fontSize: 12 }}>
          {totalItems} item{totalItems !== 1 ? 's' : ''} ordered · {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      <div style={{ background: '#E8F5E9', borderLeft: '4px solid #048A81', padding: '12px 20px' }}>
        <p style={{ margin: 0, fontSize: 13, color: '#2E7D32', fontWeight: 600 }}>📋 Order receipt — screenshot for your records</p>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#388E3C' }}>Compare against your delivery when items arrive</p>
      </div>

      {Object.entries(grouped).map(([catName, items]) => (
        <div key={catName}>
          <div style={{ background: '#2E4057', padding: '8px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{catName}</span>
            {items[0].hasOnHand && (
              <div style={{ display: 'flex', gap: 24 }}>
                <span style={{ color: '#aaa', fontSize: 10 }}>On Hand</span>
                <span style={{ color: '#aaa', fontSize: 10 }}>Order Qty</span>
              </div>
            )}
          </div>
          {items.map((item, idx) => (
            <div key={item.item} style={{ padding: '10px 20px', background: idx % 2 === 0 ? '#f9fafb' : '#fff', borderBottom: '0.5px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#1A2A3A', flex: 1 }}>{item.item}</p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {item.hasOnHand && (
                  <div style={{ background: '#f3f4f6', borderRadius: 20, padding: '4px 14px', fontWeight: 700, fontSize: 15, minWidth: 40, textAlign: 'center', color: '#666' }}>
                    {item.onHand}
                  </div>
                )}
                <div style={{ background: '#E8F5E9', color: '#2E7D32', borderRadius: 20, padding: '4px 14px', fontWeight: 800, fontSize: 16, minWidth: 40, textAlign: 'center', border: '1.5px solid #A5D6A7' }}>
                  {item.qty}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 20px', background: '#fff', borderTop: '0.5px solid #eee' }}>
        <button onClick={onNewOrder} style={{ width: '100%', background: '#1A2A3A', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          + New Order
        </button>
      </div>
    </div>
  );
}

// ── Main Form ─────────────────────────────────────────────────
export default function Home() {
  const [store, setStore] = useState('');
  const [orders, setOrders] = useState<Record<string, number>>({});
  const [onHand, setOnHand] = useState<Record<string, number>>({});
  const [screen, setScreen] = useState<'form' | 'review' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [deliveryDateStr, setDeliveryDateStr] = useState('');

  const setOrderQty = (item: string, val: number) => setOrders(o => ({ ...o, [item]: val }));
  const setOnHandQty = (item: string, val: number) => setOnHand(o => ({ ...o, [item]: val }));
  const totalOrdered = Object.values(orders).reduce((sum, v) => sum + (v || 0), 0);

  const calcDeliveryDate = () => {
    const now = new Date();
    const hour = now.getHours();
    const dow = now.getDay();
    const delivery = new Date(now);
    delivery.setHours(0, 0, 0, 0);
    if (dow === 6 && hour >= 12) delivery.setDate(delivery.getDate() + 2);
    else if (dow === 6 && hour < 12) {}
    else if (dow === 0) delivery.setDate(delivery.getDate() + 1);
    else if (hour >= 12) delivery.setDate(delivery.getDate() + 1);
    if (delivery.getDay() === 0) delivery.setDate(delivery.getDate() + 1);
    return (delivery.getMonth() + 1) + '/' + delivery.getDate() + '/' + delivery.getFullYear();
  };

  const handleReview = () => {
    if (!store) { alert('Please select your store first!'); return; }
    if (!Object.values(orders).some(qty => qty > 0)) { alert('Please order at least one item!'); return; }
    setDeliveryDateStr(calcDeliveryDate());
    setScreen('review');
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store, orders, onHand, deliveryDateStr }),
      });
      const result = await response.json();
      if (result.success) { setScreen('success'); }
      else { alert('Something went wrong: ' + result.error); }
    } catch (error: any) {
      alert('Submission failed: ' + error.message);
    } finally { setLoading(false); }
  };

  const handleNewOrder = () => { setScreen('form'); setOrders({}); setOnHand({}); setStore(''); setDeliveryDateStr(''); };

  if (screen === 'review') return <ReviewScreen store={store} orders={orders} onHand={onHand} deliveryDateStr={deliveryDateStr} onBack={() => setScreen('form')} onConfirm={handleSubmit} loading={loading} />;
  if (screen === 'success') return <SuccessScreen store={store} orders={orders} onHand={onHand} deliveryDateStr={deliveryDateStr} onNewOrder={handleNewOrder} />;

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 0 80px', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ background: '#1A2A3A', padding: '16px 20px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 4 }}>
            <img src="/lucys_logo.png" alt="Lucy's" style={{ height: 36, width: 36, objectFit: 'contain' }} />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>CK Inventory</span>
          </div>
          <span style={{ background: '#048A81', color: '#fff', fontSize: 11, padding: '3px 10px', borderRadius: 20 }}>Today</span>
        </div>
        <select value={store} onChange={e => setStore(e.target.value)}
          style={{ marginTop: 10, width: '100%', padding: '8px 12px', borderRadius: 8, border: 'none', fontSize: 14, background: store ? '#048A81' : '#2E4057', color: store ? '#fff' : '#aaa' }}>
          <option value="">— Select your store —</option>
          {STORES.map((s: string) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Categories */}
      {CATEGORIES.map((cat: any, ci: number) => (
        <div key={ci}>
          {/* Category header with static On Hand / Order Qty labels */}
          <div style={{ background: '#2E4057', padding: '8px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: 13, flex: 1 }}>{cat.name}</span>
            {cat.hasOnHand ? (
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <span style={{ color: '#aaa', fontSize: 10, width: 100, textAlign: 'center' }}>On Hand</span>
                <span style={{ color: '#aaa', fontSize: 10, width: 100, textAlign: 'center' }}>Order Qty</span>
              </div>
            ) : (
              <span style={{ color: '#aaa', fontSize: 10, width: 100, textAlign: 'center', flexShrink: 0 }}>Order Qty</span>
            )}
          </div>

          {/* Item rows — no repeated labels */}
          {cat.items.map((item: string, ii: number) => (
            <div key={ii} style={{ padding: '8px 20px', background: ii % 2 === 0 ? '#f9fafb' : '#fff', borderBottom: '0.5px solid #eee', display: 'flex', alignItems: 'center' }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#1A2A3A', flex: 1 }}>{item}</p>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                {cat.hasOnHand && (
                  <div style={{ width: 100 }}>
                    <Counter value={onHand[item] || 0} onChange={v => setOnHandQty(item, v)} color="#f3f4f6" />
                  </div>
                )}
                <div style={{ width: 100 }}>
                  <Counter value={orders[item] || 0} onChange={v => setOrderQty(item, v)} color="#e6f7f4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Submit button */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 20px', background: '#fff', borderTop: '0.5px solid #eee' }}>
        {totalOrdered > 0 && (
          <p style={{ margin: '0 0 6px', fontSize: 12, color: '#048A81', textAlign: 'center', fontWeight: 600 }}>
            {totalOrdered} item{totalOrdered !== 1 ? 's' : ''} selected
          </p>
        )}
        <button onClick={handleReview}
          style={{ width: '100%', background: '#048A81', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          Review Order — {store || 'Select Store'}
        </button>
      </div>
    </div>
  );
}
