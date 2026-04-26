import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: 'ck-inventory-service@ck-inventory-490121.iam.gserviceaccount.com',
    private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCjf6uytjMyk7Lh\nOBUxqvLqH2QtD2ZB+YvSFo1GlcyF1L8A8Y4HARspi44/U6AATrT2nckVCin2/4eP\nDW95ZVjps+4oGO63OgzwmbDukztebCbY/pPoK04F/uAG15zoj7ITnunQ6VE+M7ya\ny7w8PCInATQFGye6GUVEhnavqvbNFzhlMTW0vJu6CrCO9hBM8xz8uqOF/4z4qJMz\nGB3rtwEAyGfOVu6O+I4eTPHuJd+cv8531suuA0QaIdgK0jrUeqY3NhvCn7qJ5Sw8\nQCWo7OCmnQvrHF2n2IvJQBQUFWYbX5b3dMkv3tcwJw9T5IDlATvDhj+lhkbiMw7b\nIN46GZsHAgMBAAECggEAJbCDIIXOxIx2smNOw23QZHcLDTYdEP1ZJXtsYsaaaIlz\n5GBKqMOxAsE4b9Gzsw5xud4CohZ/OQCLu8bRmS7rMah4MIca1GMN45LSThTjnS8a\nP3BkISOGb2xjMUCX26ZwWwSJis6WG1wq0JZBlLMZ/lrRJpItdMFpjdPfXTxwezNO\nRj1xZwpj8gwMWZ4Sc5mYX4ejavA0we+1aITiN6DR4/HlH8nLXCdzpggM0KMqiInK\n0SGsBWSncnruLonKsC1ZAMcmEctOjbO5oei5Lx7GjYXM3oHS8hutkGm2juzu3bqR\n9nKMwDrio/mK0azgQi+KQczZjGLWpsjOCg3ugTuYYQKBgQDQdGPN+QKBya0qClHO\nbYgARPmu/EsCI8whgi7y8ko1Nfdhm/6zHaOPv1k6+pmfoz/cQJLDzCcphnP4BfK/\nxXyrcRAPBFHCw3ALeT2R76Tz1S9IicEUUdOSjbOkX6QkmXJI/AGyqCjjxjXAVlKs\nkumnGRBAKDzM8mvIpu/Fgy244QKBgQDIylDqKTaspK35g5v6eJo6lOWvVRI+/8rb\ni0VAsH36a8hoCQiYeQ3CXj7TtEh91GazQdb6KfvyVGY6WJmLPeVYvdweztYzm9GR\nJhDaEOfIjNzF8ToMmNUVXDKEWaq/AEnhsYabBSU9pQ+4YtkToq21OpQJNkNVQbE/\nmP2vCGjI5wKBgHld2qIYwgHo9x5MBddHZHCruCfOkql7SCWWU1l2Agi7E/5Lwd5t\nekZ+ZSh2sa0Fcm/9VLYVDhQaSTj11aEcDXsQCAaGQEhCW+ECRPvL6GFjFPWJ5tW6\n0pE4WYhxevMoOCcQOrjXOX9sbu0+FUKPAuUcLZ79DnFRD7oyn9WCi8NhAoGATFyF\nAUjDPk0yzN28iDktjnHqGBAmbEcjgvMoVz3H62DqSoaE+levX+gvxJufphsNI8c6\nVtF4u+RVLINdgZL8kg9Ck4Td+aqcvLLZXdVoEOFhZPYkuX22K/VwUN05DoKxll/J\nbVM7ooIPxHPzUoBfx7iLbCVy3g2ptyIb+GEeWKkCgYEArfMteUAFlHDtoBbGF7sB\n6FgxrORgpIJZsIhMjkn4H2u+uedm7NwfAYS6Jy2IYcYK+oGorwQjU1XSoUst6+/v\n5J4MECNXLiWSGHPaVRyW5tdoDNnkYGo1+j2CXFh4MsHxZtGpATCPY0lQT7KoG1VD\nH6U5+Cfq3RmKPv+HxmfAjDc=\n-----END PRIVATE KEY-----\n'
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

//const SPREADSHEET_ID = '15ZepcPCQjBkghOUw2Jle786BnV38hb0TXjT3bWNUNYI'; ## PRODUCTION
const SPREADSHEET_ID = '138asFl43CsZn9NaJKEkZlKa7GvckOXcNbQ5NuwdZB9g';
const STORES = ['Bedford', 'Berry', 'Grand', 'Irving', 'Onderdonk'];

export async function GET() {
  try {
    const sheets = google.sheets({ version: 'v4', auth });

    // Read Form Responses
    const formRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Form Responses 1!A:ZZ',
    });

    // Read Config tab for categories/items
    const configRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "'⚙️ Config'!A:C",
    });

    const formRows = formRes.data.values || [];
    const configRows = configRes.data.values || [];

    // Build categories from config
    const categories = [];
    const catMap = {};
    for (let r = 4; r < configRows.length; r++) {
      const catName = (configRows[r][0] || '').trim();
      const itemName = (configRows[r][1] || '').trim();
      const hasOnHand = (configRows[r][2] || '').trim().toUpperCase() === 'YES';
      if (!catName || !itemName || catName === 'Category') continue;
      if (catMap[catName] === undefined) {
        categories.push({ name: catName, items: [], hasOnHand });
        catMap[catName] = categories.length - 1;
      }
      categories[catMap[catName]].items.push(itemName);
    }

    // Calculate delivery date (ET)
    const now = new Date();
    const etNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const hour = etNow.getHours();
    const dow = etNow.getDay();
    const delivery = new Date(etNow);
    delivery.setHours(0, 0, 0, 0);

    if (dow === 6 && hour >= 12) delivery.setDate(delivery.getDate() + 2);
    else if (dow === 6) { /* today */ }
    else if (dow === 0) delivery.setDate(delivery.getDate() + 1);
    else if (hour >= 12) delivery.setDate(delivery.getDate() + 1);
    if (delivery.getDay() === 0) delivery.setDate(delivery.getDate() + 1);

    const dateKey = (d) => {
      const dt = new Date(d);
      dt.setHours(0, 0, 0, 0);
      return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
    };

    const deliveryKey = dateKey(delivery);

    // const dayBefore = new Date(delivery);
    // dayBefore.setDate(delivery.getDate() - 1);
    // const dayBeforeKey = dateKey(dayBefore);

    const deliveryLabel = delivery.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });

    // Build order map from Form Responses
    if (formRows.length < 2) return Response.json({ categories, stores: STORES, orderMap: {}, deliveryLabel });

    const headers = formRows[0].map(h => h.trim());
    const storeCol = headers.indexOf('Store');
    const dateCol = headers.indexOf('Order Date');

    const orderMap = {};
    STORES.forEach(s => orderMap[s] = {});

    for (let r = 1; r < formRows.length; r++) {
      const row = formRows[r];
      const rowStore = (row[storeCol] || '').trim();
      const rawDate = row[dateCol];
      if (!rawDate) continue;
      const rowDate = new Date(rawDate);
      if (isNaN(rowDate.getTime())) continue;

      const effectiveDate = new Date(rowDate);
      effectiveDate.setHours(0, 0, 0, 0);
      const rowDow = effectiveDate.getDay();
      if (rowDow === 0) effectiveDate.setDate(effectiveDate.getDate() + 1);

      const effectiveKey = dateKey(effectiveDate);
      //if (effectiveKey !== deliveryKey && effectiveKey !== dayBeforeKey) continue;
      if (effectiveKey !== deliveryKey) continue;
      if (!orderMap[rowStore]) continue;

      // for (let c = 0; c < headers.length; c++) {
      //   const itemName = headers[c];
      //   const raw = row[c];
      //   if (!raw) continue;
      //   const qty = parseFloat(raw);
      //   if (isNaN(qty) || qty <= 0) continue;
      //   if (!orderMap[rowStore][itemName]) orderMap[rowStore][itemName] = 0;
      //   orderMap[rowStore][itemName] += qty;
      // }

      for (let c = 0; c < headers.length; c++) {
        const itemName = headers[c];
        const raw = row[c];
        if (!raw) continue;

        // Handle glove combined-string format e.g. "XL:1,L:1,M:1" — sum all qty parts
        let qty;
        if (typeof raw === 'string' && raw.includes(':')) {
          qty = raw.split(',').reduce((sum, s) => {
            const n = parseInt(s.split(':')[1]);
            return sum + (isNaN(n) ? 0 : n);
          }, 0);
          // Merge size breakdowns across multiple submissions
          const sizeKey = itemName + ' _sizes';
          const existing = orderMap[rowStore][sizeKey] || '';
          const merged = {};
          [existing, raw].forEach(str => {
            if (!str) return;
            str.split(',').forEach(s => {
              const [size, n] = s.split(':');
              const num = parseInt(n);
              if (size && !isNaN(num)) merged[size] = (merged[size] || 0) + num;
            });
          });
          orderMap[rowStore][sizeKey] = ['XL', 'L', 'M']
            .filter(s => merged[s] > 0)
            .map(s => `${s}:${merged[s]}`)
            .join(',');
        } else {
          qty = parseFloat(raw);
        }

        if (isNaN(qty) || qty <= 0) continue;
        if (!orderMap[rowStore][itemName]) orderMap[rowStore][itemName] = 0;
        orderMap[rowStore][itemName] += qty;
      }

    }

    return Response.json({ categories, stores: STORES, orderMap, deliveryLabel, deliveryKey });
  } catch (error) {
    console.error('Commissary API error:', error.message, error.stack);
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
