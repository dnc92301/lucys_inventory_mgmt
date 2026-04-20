'use client';
import { useState, useEffect } from 'react';

const STORES = ['Berry', 'Bedford', 'Grand', 'Irving', 'Onderdonk'];

const printStyles = `
@media print {
  body * { visibility: hidden; }
  #print-area, #print-area * { visibility: visible; }
  #print-area { position: absolute; left: 0; top: 0; width: 100%; font-size: 9px; line-height: 1.2; }
  .no-print { display: none !important; }
  .print-repeat-header { position: fixed; top: 0; left: 0; right: 0; width: 100%; }
  #print-body { margin-top: 42px; }
  @page { margin: 8mm; size: A4 portrait; }
}
`;

export default function CommissaryPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/get-commissary')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'system-ui', background: '#1A2A3A', color: '#fff', fontSize: 16 }}>
      Loading today's orders...
    </div>
  );

  if (error) return (
    <div style={{ padding: 20, color: 'red', fontFamily: 'system-ui' }}>Error: {error}</div>
  );

  const { categories, orderMap, deliveryLabel } = data;

  const storeTotals: Record<string, number> = {};
  STORES.forEach(s => { storeTotals[s] = 0; });
  categories.forEach((cat: any) => {
    cat.items.forEach((item: string) => {
      STORES.forEach(s => {
        storeTotals[s] += orderMap[s]?.[item] || 0;
      });
    });
  });

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', fontFamily: 'system-ui, sans-serif', padding: '0 0 80px' }}>
      <style>{printStyles}</style>

      {/* Header - no print */}
      <div className="no-print" style={{ background: '#1A2A3A', padding: '16px 20px', position: 'sticky', top: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/lucys_logo.png" alt="Lucy's" style={{ height: 36, width: 36, objectFit: 'contain' }} />
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>CK Commissary</div>
            <div style={{ color: '#fff', fontSize: 11 }}>Delivery: {deliveryLabel}</div>
          </div>
        </div>
        <button onClick={() => setTimeout(() => window.print(), 300)}
          style={{ background: '#048A81', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          🖨️ Print / PDF
        </button>
      </div>

      {/* Print area */}
      <div id="print-area">

        {/* Repeating header - shows on every printed page */}
        <div className="print-repeat-header">
          <div style={{ background: '#e8e8e8', padding: '5px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#1A2A3A', fontWeight: 700, fontSize: 13 }}>🏪 CK COMMISSARY ORDER SHEET</div>
            <div style={{ color: '#1A2A3A', fontSize: 11 }}>📅 Delivery: {deliveryLabel}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 0.8fr', background: '#e8e8e8', padding: '3px 8px', gap: 4 }}>
            <span style={{ color: '#1A2A3A', fontWeight: 700, fontSize: 11 }}>Item</span>
            {STORES.map((s) => (
              <span key={s} style={{ fontWeight: 700, fontSize: 10, textAlign: 'center', color: '#1A2A3A' }}>
                {s}
              </span>
            ))}
            <span style={{ color: '#1A2A3A', fontWeight: 700, fontSize: 10, textAlign: 'center' }}>TOTAL</span>
          </div>
        </div>

        {/* Body - offset so it clears the fixed header on page 1 */}
        <div id="print-body">

          {/* Categories and items */}
          {categories.map((cat: any) => {
            const catItems = cat.items.filter((item: string) =>
              STORES.some(s => (orderMap[s]?.[item] || 0) > 0)
            );
            if (catItems.length === 0) return null;

            return (
              <div key={cat.name}>
                {/* Category header */}
                <div style={{ background: '#b0b8c1', padding: '2px 8px' }}>
                  <span style={{ color: '#1A2A3A', fontWeight: 600, fontSize: 11 }}>{cat.name}</span>
                </div>

                {/* Items */}
                {catItems.map((item: string, idx: number) => {
                  const storeQtys = STORES.map(s => orderMap[s]?.[item] || 0);
                  const total = storeQtys.reduce((a, b) => a + b, 0);
                  const onHandKey = `${item} - On Hand`;
                  const storeOnHand = cat.hasOnHand ? STORES.map(s => orderMap[s]?.[onHandKey] || 0) : null;
                  const bg = idx % 2 === 0 ? '#f9fafb' : '#fff';

                  return (
                    <div key={item}>
                      {/* Order row */}
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 0.8fr', padding: '2px 8px', background: bg, gap: 4, alignItems: 'center', borderBottom: '0.5px solid #eee' }}>
                        <span style={{ fontSize: 11, fontWeight: 500, color: '#1A2A3A' }}>{item}</span>
                        {storeQtys.map((qty, si) => (
                          <span key={si} style={{ textAlign: 'center', fontSize: 11, fontWeight: qty > 0 ? 700 : 400, color: qty > 0 ? '#1A2A3A' : '#ccc' }}>
                            {qty > 0 ? qty : '—'}
                          </span>
                        ))}
                        <span style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#048A81', background: '#E8F5E9', borderRadius: 4, padding: '1px 4px' }}>
                          {total}
                        </span>
                      </div>

                      {/* On Hand row */}
                      {cat.hasOnHand && storeOnHand && storeOnHand.some((v: number) => v > 0) && (
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 0.8fr', padding: '1px 8px', background: '#f0f0f0', gap: 4 }}>
                          <span style={{ fontSize: 9, color: '#888', fontStyle: 'italic' }}>↳ On Hand</span>
                          {storeOnHand.map((oh: number, si: number) => (
                            <span key={si} style={{ textAlign: 'center', fontSize: 9, color: oh > 0 ? '#555' : '#ccc', fontStyle: 'italic' }}>
                              {oh > 0 ? oh : '—'}
                            </span>
                          ))}
                          <span></span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Grand Total */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 0.8fr', background: '#e8e8e8', padding: '5px 8px', gap: 4, marginTop: 4 }}>
            <span style={{ color: '#1A2A3A', fontWeight: 700, fontSize: 11 }}>📦 TOTAL BY STORE</span>
            {STORES.map(s => (
              <span key={s} style={{ textAlign: 'center', color: '#1A2A3A', fontWeight: 700, fontSize: 11 }}>
                {storeTotals[s] || '—'}
              </span>
            ))}
            <span style={{ textAlign: 'center', color: '#1A2A3A', fontWeight: 700, fontSize: 11 }}>
              {Object.values(storeTotals).reduce((a, b) => a + b, 0)}
            </span>
          </div>

          {/* Footer */}
          <div style={{ padding: '6px 8px', background: '#f9fafb', borderTop: '1px solid #eee', marginTop: 4 }}>
            <span style={{ fontSize: 10, color: '#666', fontStyle: 'italic' }}>
              ✅ Fulfilled by: _________________________ &nbsp;&nbsp; Date: _____________ &nbsp;&nbsp; Time: _____________
            </span>
          </div>

        </div>
      </div>

      {/* Bottom print button - no print */}
      <div className="no-print" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 20px', background: '#fff', borderTop: '0.5px solid #eee' }}>
        <button onClick={() => setTimeout(() => window.print(), 300)}
          style={{ width: '100%', background: '#1A2A3A', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          🖨️ Print / Save as PDF
        </button>
      </div>
    </div>
  );
}