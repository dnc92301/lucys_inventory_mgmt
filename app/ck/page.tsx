'use client';
import { useState, useEffect } from 'react';

const STORES = ['Bedford', 'Berry', 'Grand', 'Irving', 'Onderdonk'];

// const printStyles = `
// @media print {
//   body * { visibility: hidden; }
//   #print-area, #print-area * { visibility: visible; }
//   #print-area { position: absolute; left: 0; top: 0; width: 100%; font-size: 11px; }
//   .no-print { display: none !important; }
// }
// `;

const printStyles = `
@media print {
  body * { visibility: hidden; }
  #print-area, #print-area * { visibility: visible; }
  #print-area { position: absolute; left: 0; top: 0; width: 100%; font-size: 9px; }
  .no-print { display: none !important; }
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

  // Calculate store totals from actual items only
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
            <div style={{ color: '#FFDD00', fontSize: 11 }}>Delivery: {deliveryLabel}</div>
          </div>
        </div>
        <button onClick={() => setTimeout(() => window.print(), 300)}
          style={{ background: '#048A81', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          🖨️ Print / PDF
        </button>
      </div>

      {/* Print area */}
      <div id="print-area">

        {/* Print header */}
        {/* <div style={{ background: '#1A2A3A', padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>🏪 CK COMMISSARY ORDER SHEET</div>
          <div style={{ color: '#FFDD00', fontSize: 13, marginTop: 4 }}>📅 Delivery: {deliveryLabel}</div>
        </div> */}
        <div style={{ background: '#1A2A3A', padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>🏪 CK COMMISSARY ORDER SHEET</div>
          <div style={{ color: '#FFDD00', fontSize: 13, marginTop: 4 }}>📅 Delivery: {deliveryLabel}</div>
        </div>

        {/* Store header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 0.8fr', background: '#2E4057', padding: '8px 12px', gap: 4 }}>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 12 }}>Item</span>
          {STORES.map((s, i) => (
            <span key={s} style={{ fontWeight: 600, fontSize: 11, textAlign: 'center',
              color: ['#048A81','#E63946','#F4A261','#2A9D8F','#6A4C93'][i] }}>
              {s}
            </span>
          ))}
          <span style={{ color: '#FFDD00', fontWeight: 600, fontSize: 11, textAlign: 'center' }}>TOTAL</span>
        </div>

        {/* Categories and items */}
        {categories.map((cat: any) => {
          // Check if any items have orders
          const catItems = cat.items.filter((item: string) =>
            STORES.some(s => (orderMap[s]?.[item] || 0) > 0)
          );
          if (catItems.length === 0) return null;

          return (
            <div key={cat.name}>
              {/* Category header */}
              <div style={{ background: '#2E4057', padding: '6px 12px' }}>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: 12 }}>{cat.name}</span>
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
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 0.8fr', padding: '6px 12px', background: bg, gap: 4, alignItems: 'center', borderBottom: '0.5px solid #eee' }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: '#1A2A3A' }}>{item}</span>
                      {storeQtys.map((qty, si) => (
                        <span key={si} style={{ textAlign: 'center', fontSize: 13, fontWeight: qty > 0 ? 700 : 400, color: qty > 0 ? '#1A2A3A' : '#ccc' }}>
                          {qty > 0 ? qty : '—'}
                        </span>
                      ))}
                      <span style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#048A81', background: '#E8F5E9', borderRadius: 4, padding: '2px 4px' }}>
                        {total}
                      </span>
                    </div>

                    {/* On Hand row */}
                    {cat.hasOnHand && storeOnHand && storeOnHand.some((v: number) => v > 0) && (
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 0.8fr', padding: '2px 12px', background: '#f0f0f0', gap: 4 }}>
                        <span style={{ fontSize: 10, color: '#888', fontStyle: 'italic' }}>↳ On Hand</span>
                        {storeOnHand.map((oh: number, si: number) => (
                          <span key={si} style={{ textAlign: 'center', fontSize: 10, color: oh > 0 ? '#555' : '#ccc', fontStyle: 'italic' }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 0.8fr', background: '#1A2A3A', padding: '10px 12px', gap: 4, marginTop: 8 }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>📦 TOTAL BY STORE</span>
          {STORES.map(s => (
            <span key={s} style={{ textAlign: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>
              {storeTotals[s] || '—'}
            </span>
          ))}
          <span style={{ textAlign: 'center', color: '#FFDD00', fontWeight: 700, fontSize: 13 }}>
            {Object.values(storeTotals).reduce((a, b) => a + b, 0)}
          </span>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 12px', background: '#f9fafb', borderTop: '1px solid #eee', marginTop: 8 }}>
          <span style={{ fontSize: 11, color: '#666', fontStyle: 'italic' }}>
            ✅ Fulfilled by: _________________________ &nbsp;&nbsp; Date: _____________ &nbsp;&nbsp; Time: _____________
          </span>
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
