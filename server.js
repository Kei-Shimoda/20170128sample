const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'badges.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---- Data helpers ----

function loadData() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({}));
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function publicBadge(badge) {
  const { secret, ...pub } = badge;
  return pub;
}

// ---- API routes ----

// POST /api/badges - バッジ作成
app.post('/api/badges', async (req, res) => {
  const { name, allergies, emergency_contact, notes } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: '名前は必須です' });
  }

  const id = uuidv4();
  const secret = crypto.randomBytes(20).toString('hex');
  const badgeUrl = `${req.protocol}://${req.get('host')}/badge/${id}`;
  const qrCode = await QRCode.toDataURL(badgeUrl, { width: 200, margin: 2 });

  const badge = {
    id,
    secret,
    name: name.trim(),
    allergies: Array.isArray(allergies) ? allergies : [],
    emergency_contact: (emergency_contact || '').trim(),
    notes: (notes || '').trim(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const data = loadData();
  data[id] = badge;
  saveData(data);

  res.json({ ...publicBadge(badge), secret, url: badgeUrl, qr_code: qrCode });
});

// GET /api/badges/:id - バッジ取得（公開情報）
app.get('/api/badges/:id', (req, res) => {
  const data = loadData();
  const badge = data[req.params.id];
  if (!badge) return res.status(404).json({ error: 'バッジが見つかりません' });
  res.json(publicBadge(badge));
});

// PUT /api/badges/:id - バッジ更新（secret 必須）
app.put('/api/badges/:id', (req, res) => {
  const { secret, name, allergies, emergency_contact, notes } = req.body;
  const data = loadData();
  const badge = data[req.params.id];

  if (!badge) return res.status(404).json({ error: 'バッジが見つかりません' });
  if (!secret || badge.secret !== secret) return res.status(403).json({ error: '編集キーが正しくありません' });
  if (name !== undefined && !name.trim()) return res.status(400).json({ error: '名前は必須です' });

  if (name !== undefined) badge.name = name.trim();
  if (allergies !== undefined) badge.allergies = Array.isArray(allergies) ? allergies : [];
  if (emergency_contact !== undefined) badge.emergency_contact = emergency_contact.trim();
  if (notes !== undefined) badge.notes = notes.trim();
  badge.updated_at = new Date().toISOString();

  saveData(data);
  res.json(publicBadge(badge));
});

// DELETE /api/badges/:id - バッジ削除（secret 必須）
app.delete('/api/badges/:id', (req, res) => {
  const { secret } = req.body;
  const data = loadData();
  const badge = data[req.params.id];

  if (!badge) return res.status(404).json({ error: 'バッジが見つかりません' });
  if (!secret || badge.secret !== secret) return res.status(403).json({ error: '編集キーが正しくありません' });

  delete data[req.params.id];
  saveData(data);
  res.json({ message: '削除しました' });
});

// GET /api/badges/:id/qr - QRコード再生成
app.get('/api/badges/:id/qr', async (req, res) => {
  const data = loadData();
  const badge = data[req.params.id];
  if (!badge) return res.status(404).json({ error: 'バッジが見つかりません' });

  const badgeUrl = `${req.protocol}://${req.get('host')}/badge/${badge.id}`;
  const qrCode = await QRCode.toDataURL(badgeUrl, { width: 200, margin: 2 });
  res.json({ qr_code: qrCode, url: badgeUrl });
});

// ---- HTML routes ----

// /badge/:id → badge.html
app.get('/badge/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'badge.html'));
});

// /edit/:id → edit.html
app.get('/edit/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'edit.html'));
});

app.listen(PORT, () => {
  console.log(`デジタルアレルギーバッジ サーバー起動中: http://localhost:${PORT}`);
});
