import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface StoreData {
  members: {
    phone: string;
    name: string;
    area: string;
    home: string;
    interests: string[];
    lang: string;
    createdAt: string;
  }[];
  optins: string[];
  dealInterests: {
    phone: string;
    name: string;
    city: string;
    deals: string[];
    createdAt: string;
  }[];
}

const DATA_FILE = path.join(__dirname, 'club_data.json');

function readStore(): StoreData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch {
    // ignore
  }
  return {
    members: [
      {
        phone: '9823000001',
        name: 'Priya Deshmukh',
        area: 'Dharampeth',
        home: 'house',
        interests: ['solar'],
        lang: 'en',
        createdAt: '2026-10-29T00:00:00Z',
      },
    ],
    optins: ['9823000001'],
    dealInterests: [],
  };
}

function writeStore(data: StoreData) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch {
    // ignore
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  app.get('/api/stats', (_req, res) => {
    const store = readStore();
    res.json({
      members: Math.max(1, store.members.length),
      optins: Math.max(1, store.optins.length),
    });
  });

  app.post('/api/register', (req, res) => {
    const { name, phone, area, home, interests, lang } = req.body || {};
    const cleanPhone = String(phone || '')
      .replace(/\D/g, '')
      .slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone) || !name || String(name).trim().length < 2) {
      res.status(400).json({ error: 'Invalid input' });
      return;
    }

    const store = readStore();
    let idx = store.members.findIndex((m) => m.phone === cleanPhone);
    if (idx === -1) {
      store.members.push({
        phone: cleanPhone,
        name: String(name).trim(),
        area: String(area || 'Nagpur'),
        home: String(home || 'house'),
        interests: Array.isArray(interests) ? interests : ['solar'],
        lang: String(lang || 'en'),
        createdAt: new Date().toISOString(),
      });
      idx = store.members.length - 1;
    }
    if (Array.isArray(interests) && interests.includes('solar')) {
      if (!store.optins.includes(cleanPhone)) {
        store.optins.push(cleanPhone);
      }
    }
    writeStore(store);

    const memberNumber = `GM · ${String(idx + 1).padStart(4, '0')} · NGP`;
    res.json({ status: 'pending', memberNumber });
  });

  app.post('/api/optin', (req, res) => {
    const { phone } = req.body || {};
    const cleanPhone = String(phone || '')
      .replace(/\D/g, '')
      .slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      res.status(400).json({ error: 'Invalid phone' });
      return;
    }

    const store = readStore();
    const isMember = store.members.some((m) => m.phone === cleanPhone);
    if (!isMember) {
      res.status(404).json({ error: 'Not a member yet' });
      return;
    }

    const already = store.optins.includes(cleanPhone);
    if (!already) {
      store.optins.push(cleanPhone);
      writeStore(store);
    }

    res.json({ created: !already });
  });

  app.post('/api/deals/interest', (req, res) => {
    const { deals, name, phone, city } = req.body || {};
    const cleanPhone = String(phone || '')
      .replace(/\D/g, '')
      .slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone) || !Array.isArray(deals) || !deals.length) {
      res.status(400).json({ error: 'Invalid request' });
      return;
    }

    const store = readStore();
    store.dealInterests.push({
      phone: cleanPhone,
      name: String(name || '').trim(),
      city: String(city || 'Nagpur'),
      deals,
      createdAt: new Date().toISOString(),
    });
    writeStore(store);

    const isMember = store.members.some((m) => m.phone === cleanPhone);
    res.json({ ok: true, member: isMember });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gharmalak server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
