import { google } from 'googleapis';
import { CATEGORIES, SHEET_COLUMNS } from '../../../lib/config';

//const SPREADSHEET_ID = '15ZepcPCQjBkghOUw2Jle786BnV38hb0TXjT3bWNUNYI';
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '138asFl43CsZn9NaJKEkZlKa7GvckOXcNbQ5NuwdZB9g';
const DAY_OFFSETS = [0, 1, 3, 4, 5, 6]; // Fri, Sat, Mon, Tue, Wed, Thu

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const daysSinceFriday = (d.getDay() + 2) % 7;
  d.setDate(d.getDate() - daysSinceFriday);
  return d;
}

function buildWeekDates(friday: Date): Date[] {
  return DAY_OFFSETS.map(offset => {
    const d = new Date(friday);
    d.setDate(friday.getDate() + offset);
    return d;
  });
}

function dateKey(d: Date): string {
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

function formatWeekLabel(friday: Date, thursday: Date): string {
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  return `${fmt(friday)} – ${fmt(thursday)}`;
}

function getLastNWeeks(n: number): { label: string; fridayKey: string; friday: Date }[] {
  const now = new Date();
  const currentFriday = getWeekStart(now);
  const weeks = [];
  for (let i = 0; i < n; i++) {
    const friday = new Date(currentFriday);
    friday.setDate(currentFriday.getDate() - i * 7);
    const days = buildWeekDates(friday);
    const thursday = days[days.length - 1];
    weeks.push({
      label: formatWeekLabel(friday, thursday) + (i === 0 ? ' (current)' : ''),
      fridayKey: dateKey(friday),
      friday,
    });
  }
  return weeks;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const store = searchParams.get('store');
    const fridayKey = searchParams.get('week'); // "2026-03-27"

    // Return available weeks list if no params
    if (!store && !fridayKey) {
      const weeks = getLastNWeeks(5);
      return Response.json({ weeks: weeks.map(w => ({ label: w.label, fridayKey: w.fridayKey })) });
    }

    if (!store || !fridayKey) {
      return Response.json({ error: 'store and week params required' }, { status: 400 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: 'ck-inventory-service@ck-inventory-490121.iam.gserviceaccount.com',
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') ||
          '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCjf6uytjMyk7Lh\nOBUxqvLqH2QtD2ZB+YvSFo1GlcyF1L8A8Y4HARspi44/U6AATrT2nckVCin2/4eP\nDW95ZVjps+4oGO63OgzwmbDukztebCbY/pPoK04F/uAG15zoj7ITnunQ6VE+M7ya\ny7w8PCInATQFGye6GUVEhnavqvbNFzhlMTW0vJu6CrCO9hBM8xz8uqOF/4z4qJMz\nGB3rtwEAyGfOVu6O+I4eTPHuJd+cv8531suuA0QaIdgK0jrUeqY3NhvCn7qJ5Sw8\nQCWo7OCmnQvrHF2n2IvJQBQUFWYbX5b3dMkv3tcwJw9T5IDlATvDhj+lhkbiMw7b\nIN46GZsHAgMBAAECggEAJbCDIIXOxIx2smNOw23QZHcLDTYdEP1ZJXtsYsaaaIlz\n5GBKqMOxAsE4b9Gzsw5xud4CohZ/OQCLu8bRmS7rMah4MIca1GMN45LSThTjnS8a\nP3BkISOGb2xjMUCX26ZwWwSJis6WG1wq0JZBlLMZ/lrRJpItdMFpjdPfXTxwezNO\nRj1xZwpj8gwMWZ4Sc5mYX4ejavA0we+1aITiN6DR4/HlH8nLXCdzpggM0KMqiInK\n0SGsBWSncnruLonKsC1ZAMcmEctOjbO5oei5Lx7GjYXM3oHS8hutkGm2juzu3bqR\n9nKMwDrio/mK0azgQi+KQczZjGLWpsjOCg3ugTuYYQKBgQDQdGPN+QKBya0qClHO\nbYgARPmu/EsCI8whgi7y8ko1Nfdhm/6zHaOPv1k6+pmfoz/cQJLDzCcphnP4BfK/\nxXyrcRAPBFHCw3ALeT2R76Tz1S9IicEUUdOSjbOkX6QkmXJI/AGyqCjjxjXAVlKs\nkumnGRBAKDzM8mvIpu/Fgy244QKBgQDIylDqKTaspK35g5v6eJo6lOWvVRI+/8rb\ni0VAsH36a8hoCQiYeQ3CXj7TtEh91GazQdb6KfvyVGY6WJmLPeVYvdweztYzm9GR\nJhDaEOfIjNzF8ToMmNUVXDKEWaq/AEnhsYabBSU9pQ+4YtkToq21OpQJNkNVQbE/\nmP2vCGjI5wKBgHld2qIYwgHo9x5MBddHZHCruCfOkql7SCWWU1l2Agi7E/5Lwd5t\nekZ+ZSh2sa0Fcm/9VLYVDhQaSTj11aEcDXsQCAaGQEhCW+ECRPvL6GFjFPWJ5tW6\n0pE4WYhxevMoOCcQOrjXOX9sbu0+FUKPAuUcLZ79DnFRD7oyn9WCi8NhAoGATFyF\nAUjDPk0yzN28iDktjnHqGBAmbEcjgvMoVz3H62DqSoaE+levX+gvxJufphsNI8c6\nVtF4u+RVLINdgZL8kg9Ck4Td+aqcvLLZXdVoEOFhZPYkuX22K/VwUN05DoKxll/J\nbVM7ooIPxHPzUoBfx7iLbCVy3g2ptyIb+GEeWKkCgYEArfMteUAFlHDtoBbGF7sB\n6FgxrORgpIJZsIhMjkn4H2u+uedm7NwfAYS6Jy2IYcYK+oGorwQjU1XSoUst6+/v\n5J4MECNXLiWSGHPaVRyW5tdoDNnkYGo1+j2CXFh4MsHxZtGpATCPY0lQT7KoG1VD\nH6U5+Cfq3RmKPv+HxmfAjDc=\n-----END PRIVATE KEY-----\n',
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Form Responses 1!A:ZZ',
    });

    const rows = res.data.values || [];
    const headers = rows[0].map((h: string) => String(h).trim());
    const storeCol = headers.indexOf('Store');
    const dateCol = headers.indexOf('Order Date');

    // Build week dates
    const [fy, fm, fd] = fridayKey.split('-').map(Number);
    const friday = new Date(fy, fm - 1, fd);
    const weekDates = buildWeekDates(friday);
    const weekDateKeys = weekDates.map(dateKey);
    const DAY_LABELS = ['Fri', 'Sat', 'Mon', 'Tue', 'Wed', 'Thu'];

    // Init data map: itemName → { dateKey: qty }
    const dataMap: Record<string, Record<string, number>> = {};
    SHEET_COLUMNS.forEach((item: string) => {
      dataMap[item] = {};
      weekDateKeys.forEach(dk => { dataMap[item][dk] = 0; });
    });

    // Fill from sheet rows
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      const rowStore = String(row[storeCol] || '').trim();
      if (rowStore !== store) continue;

      const rawDate = row[dateCol];
      if (!rawDate) continue;
      const rowDate = new Date(rawDate);
      if (isNaN(rowDate.getTime())) continue;
      rowDate.setHours(0, 0, 0, 0);
      const dk = dateKey(rowDate);
      if (!weekDateKeys.includes(dk)) continue;

      for (let c = 0; c < headers.length; c++) {
        const itemName = headers[c];
        if (!dataMap[itemName]) continue;
        const qty = parseFloat(row[c]);
        if (!isNaN(qty) && qty > 0) {
          dataMap[itemName][dk] = (dataMap[itemName][dk] || 0) + qty;
        }
      }
    }

    // Shape response: categories → items → days
    const result = CATEGORIES.map((cat: any) => ({
      name: cat.name,
      items: cat.items.map((item: string) => ({
        name: item,
        days: weekDateKeys.map(dk => dataMap[item]?.[dk] || 0),
        total: weekDateKeys.reduce((sum, dk) => sum + (dataMap[item]?.[dk] || 0), 0),
      })).filter((item: any) => item.total > 0),
    })).filter((cat: any) => cat.items.length > 0);

    const dayLabels = weekDates.map((d, i) =>
      `${DAY_LABELS[i]} ${d.getMonth() + 1}/${d.getDate()}`
    );

    return Response.json({ store, fridayKey, dayLabels, categories: result });

  } catch (error: any) {
    console.error('History error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}