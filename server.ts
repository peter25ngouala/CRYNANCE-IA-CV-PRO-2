import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const db = new Database("cv_app.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    firstName TEXT,
    lastName TEXT,
    phone TEXT,
    isPremium INTEGER DEFAULT 0,
    modernExpiresAt TEXT,
    classicExpiresAt TEXT,
    creativeExpiresAt TEXT,
    role TEXT DEFAULT 'user',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    amount INTEGER,
    planType TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed'
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS promo_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE,
    discount INTEGER, -- Amount in FCFA to subtract
    type TEXT DEFAULT 'fixed', -- 'fixed' or 'percentage'
    startDate TEXT,
    endDate TEXT
  );

  CREATE TABLE IF NOT EXISTS cvs (
    id TEXT PRIMARY KEY,
    userId INTEGER,
    data TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id)
  );
`);

// Create default admin if not exists
const adminEmail = 'peter25ngouala@gmail.com';
const adminExists = db.prepare("SELECT * FROM users WHERE email = ?").get(adminEmail) as any;
if (!adminExists) {
  const hashedAdminPassword = bcrypt.hashSync('Peter2005', 10);
  db.prepare("INSERT INTO users (email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?)").run(adminEmail, hashedAdminPassword, 'Peter', 'Admin', 'admin');
} else if (adminExists.role !== 'admin') {
  // Ensure existing user with this email is promoted to admin
  db.prepare("UPDATE users SET role = 'admin' WHERE email = ?").run(adminEmail);
}

db.exec(`
  CREATE TABLE IF NOT EXISTS cover_letters (
    id TEXT PRIMARY KEY,
    userId INTEGER,
    data TEXT,
    content TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id)
  );
`);

const app = express();
app.use(express.json({ limit: '10mb' }));

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

// Auth Middleware
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// --- Auth Routes ---
app.post("/api/auth/register", async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const role = email === 'peter25ngouala@gmail.com' ? 'admin' : 'user';
  try {
    const result = db.prepare("INSERT INTO users (email, password, firstName, lastName, phone, isPremium, role) VALUES (?, ?, ?, ?, ?, 0, ?)").run(email, hashedPassword, firstName, lastName, phone, role);
    const token = jwt.sign({ id: result.lastInsertRowid, email }, JWT_SECRET);
    res.json({ token, user: { id: result.lastInsertRowid, email, firstName, lastName, phone, isPremium: false, role } });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
  
  // Force admin role for the master account
  const role = user.email === 'peter25ngouala@gmail.com' ? 'admin' : user.role;
  
  res.json({ token, user: { 
    id: user.id, 
    email: user.email, 
    firstName: user.firstName, 
    lastName: user.lastName, 
    phone: user.phone, 
    isPremium: !!user.isPremium,
    modernExpiresAt: user.modernExpiresAt,
    classicExpiresAt: user.classicExpiresAt,
    creativeExpiresAt: user.creativeExpiresAt,
    role: role 
  } });
});

// --- Profile Routes ---
app.get("/api/profile", authenticate, (req: any, res) => {
  const user: any = db.prepare("SELECT id, email, firstName, lastName, phone, isPremium, modernExpiresAt, classicExpiresAt, creativeExpiresAt, role FROM users WHERE id = ?").get(req.user.id);
  res.json(user);
});

app.put("/api/profile", authenticate, (req: any, res) => {
  const { firstName, lastName, phone } = req.body;
  db.prepare("UPDATE users SET firstName = ?, lastName = ?, phone = ? WHERE id = ?").run(firstName, lastName, phone, req.user.id);
  const user: any = db.prepare("SELECT id, email, firstName, lastName, phone, isPremium, modernExpiresAt, classicExpiresAt, creativeExpiresAt, role FROM users WHERE id = ?").get(req.user.id);
  res.json(user);
});

// --- CV Routes ---
app.post("/api/cvs", authenticate, (req: any, res) => {
  const { id, data } = req.body;
  db.prepare("INSERT OR REPLACE INTO cvs (id, userId, data) VALUES (?, ?, ?)").run(id, req.user.id, JSON.stringify(data));
  res.json({ success: true });
});

app.get("/api/cvs", authenticate, (req: any, res) => {
  const cvs = db.prepare("SELECT * FROM cvs WHERE userId = ? ORDER BY createdAt DESC").all(req.user.id);
  res.json(cvs.map((cv: any) => ({ ...cv, data: JSON.parse(cv.data) })));
});

app.delete("/api/cvs/:id", authenticate, (req: any, res) => {
  db.prepare("DELETE FROM cvs WHERE id = ? AND userId = ?").run(req.params.id, req.user.id);
  res.json({ success: true });
});

// --- Cover Letter Routes ---
app.post("/api/cover-letters", authenticate, (req: any, res) => {
  const { id, data, content } = req.body;
  db.prepare("INSERT OR REPLACE INTO cover_letters (id, userId, data, content) VALUES (?, ?, ?, ?)").run(id, req.user.id, JSON.stringify(data), content);
  res.json({ success: true });
});

app.get("/api/cover-letters", authenticate, (req: any, res) => {
  const letters = db.prepare("SELECT * FROM cover_letters WHERE userId = ? ORDER BY createdAt DESC").all(req.user.id);
  res.json(letters.map((l: any) => ({ ...l, data: JSON.parse(l.data) })));
});

app.delete("/api/cover-letters/:id", authenticate, (req: any, res) => {
  db.prepare("DELETE FROM cover_letters WHERE id = ? AND userId = ?").run(req.params.id, req.user.id);
  res.json({ success: true });
});

// --- Promo Code Routes ---
app.get("/api/promo-codes/validate/:code", (req, res) => {
  const promo = db.prepare("SELECT * FROM promo_codes WHERE code = ?").get(req.params.code) as any;
  if (promo) {
    const now = new Date().toISOString().split('T')[0];
    if (promo.startDate && now < promo.startDate) {
      return res.json({ valid: false, error: "Ce code n'est pas encore actif." });
    }
    if (promo.endDate && now > promo.endDate) {
      return res.json({ valid: false, error: "Ce code a expiré." });
    }
    res.json({ valid: true, discount: promo.discount, type: promo.type });
  } else {
    res.json({ valid: false, error: "Code promo invalide." });
  }
});

// Admin routes for promo codes
app.get("/api/admin/promo-codes", authenticate, (req: any, res) => {
  const user = db.prepare("SELECT role FROM users WHERE id = ?").get(req.user.id) as any;
  if (user?.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
  
  const promos = db.prepare("SELECT * FROM promo_codes").all();
  res.json(promos);
});

app.post("/api/admin/promo-codes", authenticate, (req: any, res) => {
  const user = db.prepare("SELECT role FROM users WHERE id = ?").get(req.user.id) as any;
  if (user?.role !== 'admin') return res.status(403).json({ error: "Forbidden" });

  const { code, discount, type, startDate, endDate } = req.body;
  try {
    db.prepare("INSERT INTO promo_codes (code, discount, type, startDate, endDate) VALUES (?, ?, ?, ?, ?)").run(code, discount, type || 'fixed', startDate, endDate);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Code already exists" });
  }
});

app.delete("/api/admin/promo-codes/:id", authenticate, (req: any, res) => {
  const user = db.prepare("SELECT role FROM users WHERE id = ?").get(req.user.id) as any;
  if (user?.role !== 'admin') return res.status(403).json({ error: "Forbidden" });

  db.prepare("DELETE FROM promo_codes WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// --- Payment Routes ---
app.post("/api/payment/request", authenticate, (req: any, res) => {
  const { type, amount } = req.body;
  db.prepare("INSERT INTO payments (userId, amount, planType, status) VALUES (?, ?, ?, 'pending')").run(req.user.id, amount, type);
  res.json({ success: true, message: "Demande de paiement envoyée. Un administrateur confirmera votre accès sous peu." });
});

app.get("/api/payments/history", authenticate, (req: any, res) => {
  const history = db.prepare("SELECT * FROM payments WHERE userId = ? ORDER BY createdAt DESC").all(req.user.id);
  res.json(history);
});

// --- Admin Routes ---
const isAdmin = (req: any, res: any, next: any) => {
  const user = db.prepare("SELECT role FROM users WHERE id = ?").get(req.user.id) as any;
  if (user?.role !== 'admin') return res.status(403).json({ error: "Accès refusé" });
  next();
};

app.get("/api/admin/stats", authenticate, isAdmin, (req, res) => {
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
  const cvCount = db.prepare("SELECT COUNT(*) as count FROM cvs").get() as any;
  const paymentCount = db.prepare("SELECT COUNT(*) as count FROM payments WHERE status = 'confirmed'").get() as any;
  const pendingPayments = db.prepare("SELECT COUNT(*) as count FROM payments WHERE status = 'pending'").get() as any;
  
  res.json({
    users: userCount.count,
    cvs: cvCount.count,
    payments: paymentCount.count,
    pending: pendingPayments.count
  });
});

app.get("/api/admin/users", authenticate, isAdmin, (req, res) => {
  const users = db.prepare("SELECT id, email, firstName, lastName, phone, isPremium, role, createdAt FROM users ORDER BY createdAt DESC").all();
  res.json(users);
});

app.get("/api/admin/payments", authenticate, isAdmin, (req, res) => {
  const payments = db.prepare(`
    SELECT p.*, u.firstName, u.lastName, u.email 
    FROM payments p 
    JOIN users u ON p.userId = u.id 
    ORDER BY p.createdAt DESC
  `).all();
  res.json(payments);
});

app.post("/api/admin/payments/:id/confirm", authenticate, isAdmin, (req, res) => {
  const paymentId = req.params.id;
  const payment = db.prepare("SELECT * FROM payments WHERE id = ?").get(paymentId) as any;
  
  if (!payment) return res.status(404).json({ error: "Paiement non trouvé" });
  if (payment.status === 'confirmed') return res.json({ success: true, message: "Déjà confirmé" });

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  
  db.transaction(() => {
    db.prepare("UPDATE payments SET status = 'confirmed' WHERE id = ?").run(paymentId);
    
    if (payment.planType === 'modern') {
      db.prepare("UPDATE users SET modernExpiresAt = ? WHERE id = ?").run(expiresAt, payment.userId);
    } else if (payment.planType === 'classic') {
      db.prepare("UPDATE users SET classicExpiresAt = ? WHERE id = ?").run(expiresAt, payment.userId);
    } else if (payment.planType === 'creative') {
      db.prepare("UPDATE users SET creativeExpiresAt = ? WHERE id = ?").run(expiresAt, payment.userId);
    } else {
      db.prepare("UPDATE users SET isPremium = 1 WHERE id = ?").run(payment.userId);
    }
  })();

  res.json({ success: true, message: "Paiement confirmé et abonnement activé" });
});

async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
