const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: '🚫 Trop de requêtes depuis cette IP. Réessayez dans 15 minutes.'
});
app.use(limiter);

app.get('/', (req, res) => {
  res.send("Bienvenue sur l'API de gestion des personnes !");
});

app.get('/personnes', (req, res) => {
  db.all("SELECT * FROM personnes", [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "success", data: rows });
  });
});

app.post('/personnes', (req, res) => {
  const { nom, adresse } = req.body;
  if (!nom || !adresse) {
    return res.status(400).json({ error: "Le nom et l'adresse sont requis." });
  }

  db.run(`INSERT INTO personnes (nom, adresse) VALUES (?, ?)`, [nom, adresse], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "success", data: { id: this.lastID } });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
