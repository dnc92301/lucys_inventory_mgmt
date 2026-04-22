import { google } from 'googleapis';
import { CATEGORIES, SHEET_COLUMNS } from '../../../lib/config';

export async function POST(request) {
  try {
    const body = await request.json();
    // const { store, orders, onHand } = body;
    const { store, orders, onHand, gloveSizes } = body;


    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: 'ck-inventory-service@ck-inventory-490121.iam.gserviceaccount.com',
        private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCjf6uytjMyk7Lh\nOBUxqvLqH2QtD2ZB+YvSFo1GlcyF1L8A8Y4HARspi44/U6AATrT2nckVCin2/4eP\nDW95ZVjps+4oGO63OgzwmbDukztebCbY/pPoK04F/uAG15zoj7ITnunQ6VE+M7ya\ny7w8PCInATQFGye6GUVEhnavqvbNFzhlMTW0vJu6CrCO9hBM8xz8uqOF/4z4qJMz\nGB3rtwEAyGfOVu6O+I4eTPHuJd+cv8531suuA0QaIdgK0jrUeqY3NhvCn7qJ5Sw8\nQCWo7OCmnQvrHF2n2IvJQBQUFWYbX5b3dMkv3tcwJw9T5IDlATvDhj+lhkbiMw7b\nIN46GZsHAgMBAAECggEAJbCDIIXOxIx2smNOw23QZHcLDTYdEP1ZJXtsYsaaaIlz\n5GBKqMOxAsE4b9Gzsw5xud4CohZ/OQCLu8bRmS7rMah4MIca1GMN45LSThTjnS8a\nP3BkISOGb2xjMUCX26ZwWwSJis6WG1wq0JZBlLMZ/lrRJpItdMFpjdPfXTxwezNO\nRj1xZwpj8gwMWZ4Sc5mYX4ejavA0we+1aITiN6DR4/HlH8nLXCdzpggM0KMqiInK\n0SGsBWSncnruLonKsC1ZAMcmEctOjbO5oei5Lx7GjYXM3oHS8hutkGm2juzu3bqR\n9nKMwDrio/mK0azgQi+KQczZjGLWpsjOCg3ugTuYYQKBgQDQdGPN+QKBya0qClHO\nbYgARPmu/EsCI8whgi7y8ko1Nfdhm/6zHaOPv1k6+pmfoz/cQJLDzCcphnP4BfK/\nxXyrcRAPBFHCw3ALeT2R76Tz1S9IicEUUdOSjbOkX6QkmXJI/AGyqCjjxjXAVlKs\nkumnGRBAKDzM8mvIpu/Fgy244QKBgQDIylDqKTaspK35g5v6eJo6lOWvVRI+/8rb\ni0VAsH36a8hoCQiYeQ3CXj7TtEh91GazQdb6KfvyVGY6WJmLPeVYvdweztYzm9GR\nJhDaEOfIjNzF8ToMmNUVXDKEWaq/AEnhsYabBSU9pQ+4YtkToq21OpQJNkNVQbE/\nmP2vCGjI5wKBgHld2qIYwgHo9x5MBddHZHCruCfOkql7SCWWU1l2Agi7E/5Lwd5t\nekZ+ZSh2sa0Fcm/9VLYVDhQaSTj11aEcDXsQCAaGQEhCW+ECRPvL6GFjFPWJ5tW6\n0pE4WYhxevMoOCcQOrjXOX9sbu0+FUKPAuUcLZ79DnFRD7oyn9WCi8NhAoGATFyF\nAUjDPk0yzN28iDktjnHqGBAmbEcjgvMoVz3H62DqSoaE+levX+gvxJufphsNI8c6\nVtF4u+RVLINdgZL8kg9Ck4Td+aqcvLLZXdVoEOFhZPYkuX22K/VwUN05DoKxll/J\nbVM7ooIPxHPzUoBfx7iLbCVy3g2ptyIb+GEeWKkCgYEArfMteUAFlHDtoBbGF7sB\n6FgxrORgpIJZsIhMjkn4H2u+uedm7NwfAYS6Jy2IYcYK+oGorwQjU1XSoUst6+/v\n5J4MECNXLiWSGHPaVRyW5tdoDNnkYGo1+j2CXFh4MsHxZtGpATCPY0lQT7KoG1VD\nH6U5+Cfq3RmKPv+HxmfAjDc=\n-----END PRIVATE KEY-----\n'
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    //const spreadsheetId = '15ZepcPCQjBkghOUw2Jle786BnV38hb0TXjT3bWNUNYI';
    const spreadsheetId = process.env.SPREADSHEET_ID || '138asFl43CsZn9NaJKEkZlKa7GvckOXcNbQ5NuwdZB9g';

    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    // ── Rock-solid ET date using en-CA locale (gives YYYY-MM-DD) ──
    const now = new Date();
    const etDateStr = now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' }); // "2026-03-20"
    const etHourStr = now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', hour12: false });
    const etHour = parseInt(etHourStr); // 0-23
    const [etYear, etMonth, etDay] = etDateStr.split('-').map(Number);
    const etDow = new Date(etYear, etMonth - 1, etDay).getDay(); // 0=Sun...6=Sat

    const delivery = new Date(etYear, etMonth - 1, etDay);


    if (etDow === 6 && etHour >= 12) {
      delivery.setDate(delivery.getDate() + 2);      // Sat after noon → Mon
    } else if (etDow === 6 && etHour < 12) {
      // Sat before noon → today, no change
    } else if (etDow === 0) {
      delivery.setDate(delivery.getDate() + 1);      // Sun → Mon
    } else if (etHour >= 12) {
      delivery.setDate(delivery.getDate() + 1);      // Weekday PM → tomorrow
    }
    // Weekday before noon → today (no change)

    // Safety: never land on Sunday
    if (delivery.getDay() === 0) {
      delivery.setDate(delivery.getDate() + 1);
    }

    const dm = delivery.getMonth() + 1;
    const dd = delivery.getDate();
    const dy = delivery.getFullYear();
    const deliveryDateStr = dm + '/' + dd + '/' + dy;

    // Map order quantities to exact sheet column order
    // const itemValues = SHEET_COLUMNS.map(col => orders[col] || '');
    // const itemValues = SHEET_COLUMNS.map(col => {
    //   if (col === 'Glove_XL') return gloveSizes?.XL || '';
    //   if (col === 'Glove_L')  return gloveSizes?.L  || '';
    //   if (col === 'Glove_M')  return gloveSizes?.M  || '';
    //   return orders[col] || '';
    // });
    // ── FIX: Read header row first, write by name not position ──
    const headerRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Form Responses 1!1:1',
    });
    const sheetHeaders = (headerRes.data.values?.[0] || []).map(h => String(h).trim());
    const rowSize = sheetHeaders.length;
    const row = new Array(rowSize).fill('');

    // Fixed columns
    row[0] = timestamp;
    row[1] = store;
    row[2] = deliveryDateStr;

    // Write each item qty to its exact column position by name
    for (const col of SHEET_COLUMNS) {
      const idx = sheetHeaders.indexOf(col);
      if (idx !== -1) row[idx] = orders[col] || '';
    }

    // Write onHand values — match "Item Name - On Hand" headers
    const onHandItems = CATEGORIES.filter(cat => cat.hasOnHand).flatMap(cat => cat.items);
    for (const item of onHandItems) {
      const onHandHeader = item + ' - On Hand';
      const idx = sheetHeaders.findIndex(h => h.replace(/\s+/g, ' ').trim() === onHandHeader.trim());
      if (idx !== -1 && onHand[item]) row[idx] = onHand[item];
    }
    // ── END FIX ──

    // Write glove sizes as combined string e.g. "XL:1,L:1" (skip zeros)
    const GLOVE_ITEM = 'Glove XL/L/M/S 手套 (CS)';
    if (gloveSizes) {
      const gloveStr = ['XL', 'L', 'M']
        .filter(s => (gloveSizes[s] || 0) > 0)
        .map(s => `${s}:${gloveSizes[s]}`)
        .join(',');
      const gloveIdx = sheetHeaders.indexOf(GLOVE_ITEM);
      if (gloveIdx !== -1) row[gloveIdx] = gloveStr;
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Form Responses 1!A:A',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: { values: [row] },
    });

    return Response.json({ success: true, debug: { etDateStr, etHour, etDow, deliveryDateStr } });

  } catch (error) {
    console.error('Sheets error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
