'use client';
import { useState, useEffect } from 'react';
import { STORES } from '../../lib/config';

const WEEK_COUNT = 5;

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const daysSinceFriday = (d.getDay() + 2) % 7;
  d.setDate(d.getDate() - daysSinceFriday);
  return d;
}

function dateKey(d: Date): string {
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

function buildWeeks() {
  const now = new Date();
  const currentFriday = getWeekStart(now);
  const weeks = [];
  for (let i = 0; i < WEEK_COUNT; i++) {
    const friday = new Date(currentFriday);
    friday.setDate(currentFriday.getDate() - i * 7);
    const thursday = new Date(friday);
    thursday.setDate(friday.getDate() + 6);
    const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
    weeks.push({
      label: `${fmt(friday)} – ${fmt(thursday)}` + (i === 0 ? ' (current)' : ''),
      fridayKey: dateKey(friday),
    });
  }
  return weeks;
}

export default function HistoryPage() {
  const [store, setStore] = useState('');
  const [fridayKey, setFridayKey] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const weeks = buildWeeks();

  useEffect(() => {
    if (!fridayKey && weeks.length > 0) setFridayKey(weeks[0].fridayKey);
  }, []);

  const handleLoad = async () => {
    if (!store || !fridayKey) return;
    setLoading(true);
    setError('');
    setData(null);
    try {
      const res = await fetch(`/api/order-history?store=${encodeURIComponent(store)}&week=${fridayKey}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const totalOrders = data?.categories?.reduce((sum: number, cat: any) =>
    sum + cat.items.reduce((s: number, i: any) => s + i.total, 0), 0) || 0;



  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 0 80px', fontFamily: 'system-ui, sans-serif' }}>

      <style>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ background: '#1A2A3A', padding: '10px 16px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* <img src="/lucys_logo.png" alt="Lucy's" style={{ height: 28, width: 28, objectFit: 'contain' }} /> */}
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Order history</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginLeft: 4 }}>View submitted orders by store &amp; week</span>
        </div>
      </div>

      {/* Filters — tighter */}
      <div style={{ padding: '10px 16px', background: '#f9fafb', borderBottom: '0.5px solid #eee', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 3 }}>Store</label>
          <select
            value={store}
            onChange={e => { setStore(e.target.value); setData(null); }}
            style={{ width: '100%', padding: '6px 10px', borderRadius: 8, border: '0.5px solid #ccc', fontSize: 13, background: store ? '#048A81' : '#fff', color: store ? '#fff' : '#999' }}
          >
            <option value="">— Select —</option>
            {(STORES as string[]).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ flex: 1.5 }}>
          <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 3 }}>Week</label>
          <select
            value={fridayKey}
            onChange={e => { setFridayKey(e.target.value); setData(null); }}
            style={{ width: '100%', padding: '6px 10px', borderRadius: 8, border: '0.5px solid #ccc', fontSize: 13, background: '#fff', color: '#1A2A3A' }}
          >
            {weeks.map(w => <option key={w.fridayKey} value={w.fridayKey}>{w.label}</option>)}
          </select>
        </div>
        <button
          onClick={handleLoad}
          disabled={!store || !fridayKey || loading}
          style={{ background: !store || loading ? '#888' : '#048A81', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: !store ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
        >
          {loading ? '...' : 'View'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#FFF0F0', borderLeft: '4px solid #E24B4A', padding: '10px 16px', fontSize: 13, color: '#A32D2D' }}>
          {error}
        </div>
      )}

      {/* Results */}
      {data && (
        <>
          <div style={{ background: '#E8F5E9', borderLeft: '4px solid #048A81', padding: '8px 16px' }}>
            <p style={{ margin: 0, fontSize: 13, color: '#2E7D32', fontWeight: 600 }}>
              {data.store} · {weeks.find(w => w.fridayKey === fridayKey)?.label?.replace(' (current)', '')}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#388E3C' }}>
              {totalOrders} total units ordered · {data.categories.length} categories
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 500 }}>
              <thead>
                <tr style={{ background: '#2E4057' }}>
                  <td style={{ padding: '6px 12px', color: '#fff', fontWeight: 500, minWidth: 200, maxWidth: 200, width: 200 }}>Item</td>
                  {data.dayLabels.map((lbl: string) => (
                    <td key={lbl} style={{ padding: '6px 4px', color: '#aaa', textAlign: 'center', whiteSpace: 'nowrap', fontSize: 10 }}>{lbl}</td>
                  ))}
                  <td style={{ padding: '6px 8px', color: '#fff', textAlign: 'center', fontWeight: 600, whiteSpace: 'nowrap' }}>Total</td>
                </tr>
              </thead>
              <tbody>
                {data.categories.map((cat: any) => (
                  <>
                    <tr key={cat.name} style={{ background: '#2E4057' }}>
                      <td colSpan={data.dayLabels.length + 2} style={{ padding: '4px 12px', color: '#fff', fontSize: 11, fontWeight: 500 }}>
                        {cat.name}
                      </td>
                    </tr>
                    {cat.items.map((item: any, idx: number) => (
                      <tr key={item.name} style={{ background: idx % 2 === 0 ? '#f9fafb' : '#fff' }}>
                        <td style={{ padding: '5px 12px', color: '#1A2A3A', fontSize: 12, minWidth: 200, maxWidth: 200, width: 200, wordBreak: 'keep-all', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</td>
                        {item.days.map((qty: number, di: number) => (
                          <td key={di} style={{ padding: '5px 4px', textAlign: 'center', color: qty > 0 ? '#1A2A3A' : '#ccc', fontSize: 12 }}>
                            {qty > 0 ? qty : '—'}
                          </td>
                        ))}
                        <td style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 600, color: '#048A81', fontSize: 12 }}>
                          {item.total}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background: '#E8F4F8' }}>
                      <td style={{ padding: '4px 12px', color: '#555', fontSize: 11, fontStyle: 'italic' }}>
                        {cat.name.replace(/^[^\s]+\s/, '')} subtotal
                      </td>
                      {data.dayLabels.map((_: string, di: number) => {
                        const daySum = cat.items.reduce((s: number, i: any) => s + (i.days[di] || 0), 0);
                        return (
                          <td key={di} style={{ padding: '4px 4px', textAlign: 'center', color: '#555', fontSize: 11 }}>
                            {daySum > 0 ? daySum : '—'}
                          </td>
                        );
                      })}
                      <td style={{ padding: '4px 8px', textAlign: 'center', fontWeight: 600, color: '#048A81', fontSize: 11 }}>
                        {cat.items.reduce((s: number, i: any) => s + i.total, 0)}
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* <div style={{ padding: '10px 16px', borderTop: '0.5px solid #eee', background: '#fff' }}>
            <button
              onClick={() => window.print()}
              style={{ width: '100%', background: '#fff', color: '#048A81', border: '1.5px solid #048A81', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              Print / Save PDF
            </button>
          </div> */}
        </>
      )}

      {!data && !loading && !error && (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#aaa' }}>
          <p style={{ fontSize: 32, margin: '0 0 8px' }}>📋</p>
          <p style={{ margin: 0, fontSize: 14 }}>Select a store and week to view orders</p>
        </div>
      )}
    </div>
  );
}