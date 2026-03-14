import { google } from 'googleapis';
import { CATEGORIES, SHEET_COLUMNS } from '../../../lib/config';

export async function POST(request) {
  try {
    const body = await request.json();
    const { store, orders, onHand } = body;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: 'ck-inventory-service@ck-inventory-490121.iam.gserviceaccount.com',
        private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCjf6uytjMyk7Lh\nOBUxqvLqH2QtD2ZB+YvSFo1GlcyF1L8A8Y4HARspi44/U6AATrT2nckVCin2/4eP\nDW95ZVjps+4oGO63OgzwmbDukztebCbY/pPoK04F/uAG15zoj7ITnunQ6VE+M7ya\ny7w8PCInATQFGye6GUVEhnavqvbNFzhlMTW0vJu6CrCO9hBM8xz8uqOF/4z4qJMz\nGB3rtwEAyGfOVu6O+I4eTPHuJd+cv8531suuA0QaIdgK0jrUeqY3NhvCn7qJ5Sw8\nQCWo7OCmnQvrHF2n2IvJQBQUFWYbX5b3dMkv3tcwJw9T5IDlATvDhj+lhkbiMw7b\nIN46GZsHAgMBAAECggEAJbCDIIXOxIx2smNOw23QZHcLDTYdEP1ZJXtsYsaaaIlz\n5GBKqMOxAsE4b9Gzsw5xud4CohZ/OQCLu8bRmS7rMah4MIca1GMN45LSThTjnS8a\nP3BkISOGb2xjMUCX26ZwWwSJis6WG1wq0JZBlLMZ/lrRJpItdMFpjdPfXTxwezNO\nRj1xZwpj8gwMWZ4Sc5mYX4ejavA0we+1aITiN6DR4/HlH8nLXCdzpggM0KMqiInK\n0SGsBWSncnruLonKsC1ZAMcmEctOjbO5oei5Lx7GjYXM3oHS8hutkGm2juzu3bqR\n9nKMwDrio/mK0azgQi+KQczZjGLWpsjOCg3ugTuYYQKBgQDQdGPN+QKBya0qClHO\nbYgARPmu/EsCI8whgi7y8ko1Nfdhm/6zHaOPv1k6+pmfoz/cQJLDzCcphnP4BfK/\nxXyrcRAPBFHCw3ALeT2R76Tz1S9IicEUUdOSjbOkX6QkmXJI/AGyqCjjxjXAVlKs\nkumnGRBAKDzM8mvIpu/Fgy244QKBgQDIylDqKTaspK35g5v6eJo6lOWvVRI+/8rb\ni0VAsH36a8hoCQiYeQ3CXj7TtEh91GazQdb6KfvyVGY6WJmLPeVYvdweztYzm9GR\nJhDaEOfIjNzF8ToMmNUVXDKEWaq/AEnhsYabBSU9pQ+4YtkToq21OpQJNkNVQbE/\nmP2vCGjI5wKBgHld2qIYwgHo9x5MBddHZHCruCfOkql7SCWWU1l2Agi7E/5Lwd5t\nekZ+ZSh2sa0Fcm/9VLYVDhQaSTj11aEcDXsQCAaGQEhCW+ECRPvL6GFjFPWJ5tW6\n0pE4WYhxevMoOCcQOrjXOX9sbu0+FUKPAuUcLZ79DnFRD7oyn9WCi8NhAoGATFyF\nAUjDPk0yzN28iDktjnHqGBAmbEcjgvMoVz3H62DqSoaE+levX+gvxJufphsNI8c6\nVtF4u+RVLINdgZL8kg9Ck4Td+aqcvLLZXdVoEOFhZPYkuX22K/VwUN05DoKxll/J\nbVM7ooIPxHPzUoBfx7iLbCVy3g2ptyIb+GEeWKkCgYEArfMteUAFlHDtoBbGF7sB\n6FgxrORgpIJZsIhMjkn4H2u+uedm7NwfAYS6Jy2IYcYK+oGorwQjU1XSoUst6+/v\n5J4MECNXLiWSGHPaVRyW5tdoDNnkYGo1+j2CXFh4MsHxZtGpATCPY0lQT7KoG1VD\nH6U5+Cfq3RmKPv+HxmfAjDc=\n-----END PRIVATE KEY-----\n'
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '15ZepcPCQjBkghOUw2Jle786BnV38hb0TXjT3bWNUNYI';

    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    const deliveryDateStr = deliveryDate.toLocaleDateString('en-US');

    // Map order quantities to exact sheet column order
    const itemValues = SHEET_COLUMNS.map(col => orders[col] || '');

    // Map on hand values for proteins and veggies only
    const onHandValues = CATEGORIES
      .filter(cat => cat.hasOnHand)
      .flatMap(cat => cat.items)
      .map(item => onHand[item] || '');

    const row = [timestamp, store, deliveryDateStr, ...itemValues, '', ...onHandValues];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Form Responses 1!A:A',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: { values: [row] },
    });

    fetch('https://script.google.com/macros/s/AKfycbzUFyOUasxAuuDnjHj9Uqaopu6ZwM1tNUp_2r6dQW8g8XUF57zVCzsm1IU6CN88ko3p/exec');

    return Response.json({ success: true });

  } catch (error) {
    console.error('Sheets error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}