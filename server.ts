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
    status TEXT DEFAULT 'active',
    referredBy INTEGER,
    cvGenerationsRemaining INTEGER DEFAULT 0,
    letterGenerationsRemaining INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(referredBy) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS referrals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    referrerId INTEGER,
    referredUserId INTEGER,
    rewardGranted TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(referrerId) REFERENCES users(id),
    FOREIGN KEY(referredUserId) REFERENCES users(id)
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

  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoiceNumber TEXT UNIQUE,
    userId INTEGER,
    paymentId INTEGER,
    amount INTEGER,
    planType TEXT,
    paymentMethod TEXT DEFAULT 'Wave',
    status TEXT DEFAULT 'Paid',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(paymentId) REFERENCES payments(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    senderId INTEGER,
    content TEXT,
    invoiceId INTEGER,
    isRead INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(senderId) REFERENCES users(id),
    FOREIGN KEY(invoiceId) REFERENCES invoices(id)
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

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    rating INTEGER,
    content TEXT,
    isApproved INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS sent_emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    subject TEXT,
    content TEXT,
    sentAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS password_resets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    token TEXT UNIQUE,
    expiresAt DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id)
  );
`);

// --- Email Helper ---
const sendEmail = (userId: number, subject: string, content: string) => {
  try {
    db.prepare("INSERT INTO sent_emails (userId, subject, content) VALUES (?, ?, ?)").run(userId, subject, content);
    console.log(`[EMAIL SENT] To User ${userId}: ${subject}`);
  } catch (err) {
    console.error("Failed to log sent email:", err);
  }
};

// Migration: Add missing columns to users table if they don't exist
const tableInfo = db.prepare("PRAGMA table_info(users)").all() as any[];
const columnNames = tableInfo.map(col => col.name);

if (!columnNames.includes('cvGenerationsRemaining')) {
  db.exec("ALTER TABLE users ADD COLUMN cvGenerationsRemaining INTEGER DEFAULT 0");
}
if (!columnNames.includes('letterGenerationsRemaining')) {
  db.exec("ALTER TABLE users ADD COLUMN letterGenerationsRemaining INTEGER DEFAULT 0");
}
if (!columnNames.includes('referredBy')) {
  db.exec("ALTER TABLE users ADD COLUMN referredBy INTEGER REFERENCES users(id)");
}
if (!columnNames.includes('status')) {
  db.exec("ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active'");
}

// Migration: Add missing columns to cvs table
const cvsTableInfo = db.prepare("PRAGMA table_info(cvs)").all() as any[];
const cvsColumnNames = cvsTableInfo.map(col => col.name);

if (!cvsColumnNames.includes('atsScore')) {
  db.exec("ALTER TABLE cvs ADD COLUMN atsScore INTEGER");
}
if (!cvsColumnNames.includes('isOptimized')) {
  db.exec("ALTER TABLE cvs ADD COLUMN isOptimized INTEGER DEFAULT 0");
}

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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

// --- Public Stats ---
app.get("/api/public/stats", (req, res) => {
  try {
    const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
    const totalCvs = db.prepare("SELECT COUNT(*) as count FROM cvs").get() as any;
    const today = new Date().toISOString().split('T')[0];
    const cvsToday = db.prepare("SELECT COUNT(*) as count FROM cvs WHERE date(createdAt) = ?").get(today) as any;
    
    res.json({
      totalCvs: 12450 + (totalCvs.count || 0), // Base + real
      totalUsers: 3200 + (totalUsers.count || 0),
      cvsToday: 85 + (cvsToday.count || 0),
      satisfaction: 4.9
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Auth Routes ---
app.post("/api/auth/register", async (req, res) => {
  const { email, password, firstName, lastName, phone, referredBy } = req.body;
  
  try {
    const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (existingUser) {
      return res.status(400).json({ error: "Cet email est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = email === 'peter25ngouala@gmail.com' ? 'admin' : 'user';
    
    const result = db.prepare("INSERT INTO users (email, password, firstName, lastName, phone, isPremium, role, referredBy, cvGenerationsRemaining, letterGenerationsRemaining) VALUES (?, ?, ?, ?, ?, 0, ?, ?, 0, 0)").run(email, hashedPassword, firstName, lastName, phone, role, referredBy || null);
    
    // Handle Referral Reward for Referrer
    if (referredBy) {
      const referrer: any = db.prepare("SELECT * FROM users WHERE id = ?").get(referredBy);
      if (referrer) {
        db.prepare("INSERT INTO referrals (referrerId, referredUserId) VALUES (?, ?)").run(referredBy, result.lastInsertRowid);
        
        const referralCount = db.prepare("SELECT COUNT(*) as count FROM referrals WHERE referrerId = ?").get(referredBy) as any;
        const count = referralCount.count;
        
        let hoursToAdd = 0;
        let rewardName = "";
        
        if (count === 1) { hoursToAdd = 12; rewardName = "12h (1er parrainage)"; }
        else if (count === 3) { hoursToAdd = 24; rewardName = "24h (3 parrainages)"; }
        else if (count === 10) { hoursToAdd = 168; rewardName = "7 jours (10 parrainages)"; }
        
        if (hoursToAdd > 0) {
          // Extend all active subscriptions or just give a base premium if they have none?
          // Let's extend any existing expiry or set a new one if they are premium
          const now = new Date();
          const updateExpiry = (currentExpiry: string | null) => {
            const baseDate = currentExpiry && new Date(currentExpiry) > now ? new Date(currentExpiry) : now;
            baseDate.setHours(baseDate.getHours() + hoursToAdd);
            return baseDate.toISOString();
          };
          
          db.prepare(`
            UPDATE users SET 
              modernExpiresAt = CASE WHEN modernExpiresAt IS NOT NULL THEN ? ELSE modernExpiresAt END,
              classicExpiresAt = CASE WHEN classicExpiresAt IS NOT NULL THEN ? ELSE classicExpiresAt END,
              creativeExpiresAt = CASE WHEN creativeExpiresAt IS NOT NULL THEN ? ELSE creativeExpiresAt END
            WHERE id = ?
          `).run(updateExpiry(referrer.modernExpiresAt), updateExpiry(referrer.classicExpiresAt), updateExpiry(referrer.creativeExpiresAt), referredBy);
          
          db.prepare("UPDATE referrals SET rewardGranted = ? WHERE referrerId = ? AND referredUserId = ?").run(rewardName, referredBy, result.lastInsertRowid);
        }
      }
    }

    const token = jwt.sign({ id: result.lastInsertRowid, email }, JWT_SECRET);
    
    // Trigger Welcome Email
    sendEmail(result.lastInsertRowid as number, "Bienvenue sur CRYNANCE IA CV PRO 2", `
      Bonjour ${firstName},
      
      Merci de vous être inscrit sur CRYNANCE IA CV PRO 2.
      
      Vous pouvez maintenant créer votre CV professionnel et votre lettre de motivation avec l'intelligence artificielle.
      
      L'équipe CRYNANCE.
    `);

    res.json({ token, user: { id: result.lastInsertRowid, email, firstName, lastName, phone, isPremium: false, role } });
  } catch (err: any) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: "Cet email est déjà utilisé." });
    }
    console.error("Registration error:", err);
    res.status(500).json({ error: "Une erreur est survenue lors de l'inscription." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  if (user.status === 'banned') {
    return res.status(403).json({ error: "Votre compte a été banni. Veuillez contacter le support." });
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

// --- Password Reset Routes ---
import crypto from "crypto";

app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  const user: any = db.prepare("SELECT id, firstName FROM users WHERE email = ?").get(email);
  
  if (!user) {
    // Return success anyway to prevent email enumeration
    return res.json({ success: true, message: "Si cet email existe, un lien de réinitialisation a été envoyé." });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour

  db.prepare("INSERT INTO password_resets (userId, token, expiresAt) VALUES (?, ?, ?)").run(user.id, token, expiresAt);

  // In a real app, send an actual email with a link like: https://yourdomain.com/reset-password?token=...
  // Here we just log it and use our mock sendEmail
  const resetLink = `${req.protocol}://${req.get('host')}/#/reset-password?token=${token}`;
  
  sendEmail(user.id, "Réinitialisation de votre mot de passe", `
    Bonjour ${user.firstName},
    
    Vous avez demandé à réinitialiser votre mot de passe.
    Veuillez cliquer sur le lien ci-dessous pour créer un nouveau mot de passe :
    
    ${resetLink}
    
    Ce lien expirera dans 1 heure.
    Si vous n'avez pas fait cette demande, ignorez cet email.
  `);

  // For testing purposes during development, we might return the token, but in prod we shouldn't.
  // We'll return it here just so the user can test it without a real email server.
  res.json({ success: true, message: "Un lien de réinitialisation a été envoyé.", _devToken: token });
});

app.post("/api/auth/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  
  const resetRecord: any = db.prepare("SELECT * FROM password_resets WHERE token = ? AND expiresAt > ?").get(token, new Date().toISOString());
  
  if (!resetRecord) {
    return res.status(400).json({ error: "Le lien de réinitialisation est invalide ou a expiré." });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  db.transaction(() => {
    db.prepare("UPDATE users SET password = ? WHERE id = ?").run(hashedPassword, resetRecord.userId);
    db.prepare("DELETE FROM password_resets WHERE userId = ?").run(resetRecord.userId);
  })();

  res.json({ success: true, message: "Votre mot de passe a été réinitialisé avec succès." });
});

// --- Profile Routes ---
app.get("/api/profile", authenticate, (req: any, res) => {
  const user: any = db.prepare("SELECT id, email, firstName, lastName, phone, isPremium, modernExpiresAt, classicExpiresAt, creativeExpiresAt, role, cvGenerationsRemaining, letterGenerationsRemaining FROM users WHERE id = ?").get(req.user.id);
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
  const { id, data, atsScore, isOptimized } = req.body;
  db.prepare("INSERT OR REPLACE INTO cvs (id, userId, data, atsScore, isOptimized) VALUES (?, ?, ?, ?, ?)").run(
    id, 
    req.user.id, 
    JSON.stringify(data),
    atsScore || null,
    isOptimized ? 1 : 0
  );
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

// --- Admin Routes ---
const isAdmin = (req: any, res: any, next: any) => {
  const user = db.prepare("SELECT role FROM users WHERE id = ?").get(req.user.id) as any;
  if (user?.role !== 'admin') return res.status(403).json({ error: "Accès refusé" });
  next();
};

// --- IA Routes ---
app.post("/api/ia/consume", authenticate, (req: any, res) => {
  console.log(`>>> IA Consume request received for user ${req.user.id}, type: ${req.body.type}`);
  try {
    const { type } = req.body; // 'cv' or 'letter'
    const user: any = db.prepare("SELECT cvGenerationsRemaining, letterGenerationsRemaining FROM users WHERE id = ?").get(req.user.id);
    
    if (!user) {
      console.warn(`>>> User ${req.user.id} not found in DB`);
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const cvRemaining = user.cvGenerationsRemaining || 0;
    const letterRemaining = user.letterGenerationsRemaining || 0;
    console.log(`>>> User ${req.user.id} has ${cvRemaining} CV and ${letterRemaining} letter credits remaining`);
    
    if (type === 'cv') {
      if (cvRemaining <= 0) {
        console.warn(`>>> User ${req.user.id} has no CV credits left`);
        return res.status(403).json({ error: "Plus de générations de CV disponibles. Veuillez renouveler votre abonnement." });
      }
      db.prepare("UPDATE users SET cvGenerationsRemaining = cvGenerationsRemaining - 1 WHERE id = ?").run(req.user.id);
    } else if (type === 'letter') {
      if (letterRemaining <= 0) {
        console.warn(`>>> User ${req.user.id} has no letter credits left`);
        return res.status(403).json({ error: "Plus de générations de lettres disponibles. Veuillez renouveler votre abonnement." });
      }
      db.prepare("UPDATE users SET letterGenerationsRemaining = letterGenerationsRemaining - 1 WHERE id = ?").run(req.user.id);
    } else {
      return res.status(400).json({ error: "Type invalide" });
    }
    
    console.log(`>>> Credit consumed successfully for user ${req.user.id}`);
    res.json({ success: true });
  } catch (err: any) {
    console.error(">>> Error in /api/ia/consume:", err);
    res.status(500).json({ error: err.message || "Erreur interne" });
  }
});

// --- Referral Routes ---
app.get("/api/referrals", authenticate, (req: any, res) => {
  const referrals = db.prepare(`
    SELECT r.*, u.firstName, u.lastName, u.email 
    FROM referrals r 
    JOIN users u ON r.referredUserId = u.id 
    WHERE r.referrerId = ?
    ORDER BY r.createdAt DESC
  `).all(req.user.id);
  res.json(referrals);
});

// --- Admin Stats ---
app.get("/api/admin/ia-stats", authenticate, isAdmin, (req, res) => {
  const totalCvs = db.prepare("SELECT COUNT(*) as count FROM cvs").get() as any;
  const totalLetters = db.prepare("SELECT COUNT(*) as count FROM cover_letters").get() as any;
  
  const atsStats = db.prepare(`
    SELECT AVG(atsScore) as avgScore, 
           COUNT(CASE WHEN isOptimized = 1 THEN 1 END) as optimizedCount
    FROM cvs
    WHERE atsScore IS NOT NULL
  `).get() as any;

  const consumptionByUser = db.prepare(`
    SELECT u.email, 
           (SELECT COUNT(*) FROM cvs WHERE userId = u.id) as cvCount,
           (SELECT COUNT(*) FROM cover_letters WHERE userId = u.id) as letterCount
    FROM users u
    ORDER BY (cvCount + letterCount) DESC
    LIMIT 20
  `).all();

  res.json({
    totalGenerations: totalCvs.count + totalLetters.count,
    totalCvs: totalCvs.count,
    totalLetters: totalLetters.count,
    avgAtsScore: Math.round(atsStats.avgScore || 0),
    optimizedCvsCount: atsStats.optimizedCount || 0,
    consumptionByUser
  });
});

app.get("/api/admin/referral-stats", authenticate, isAdmin, (req, res) => {
  const topReferrers = db.prepare(`
    SELECT u.email, u.firstName, u.lastName, COUNT(r.id) as referralCount
    FROM users u
    JOIN referrals r ON u.id = r.referrerId
    GROUP BY u.id
    ORDER BY referralCount DESC
  `).all();

  res.json(topReferrers);
});

app.get("/api/admin/revenue-stats", authenticate, isAdmin, (req: any, res) => {
  try {
    // Summary Stats
    const today = new Date().toISOString().split('T')[0];
    const todayRevenue = db.prepare("SELECT SUM(amount) as total FROM payments WHERE status = 'confirmed' AND date(createdAt) = ?").get(today) as any;
    
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weekRevenue = db.prepare("SELECT SUM(amount) as total FROM payments WHERE status = 'confirmed' AND createdAt >= ?").get(weekStart.toISOString()) as any;
    
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthRevenue = db.prepare("SELECT SUM(amount) as total FROM payments WHERE status = 'confirmed' AND createdAt >= ?").get(monthStart.toISOString()) as any;
    
    const totalRevenue = db.prepare("SELECT SUM(amount) as total FROM payments WHERE status = 'confirmed'").get() as any;
    const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
    const totalSubscriptions = db.prepare("SELECT COUNT(*) as count FROM payments WHERE status = 'confirmed'").get() as any;
    const confirmedPaymentsCount = totalSubscriptions.count;

    // Time-series data
    const dailyRevenue = db.prepare(`
      SELECT date(createdAt) as name, SUM(amount) as value 
      FROM payments 
      WHERE status = 'confirmed' 
      AND createdAt >= date('now', '-30 days')
      GROUP BY date(createdAt) 
      ORDER BY date(createdAt) ASC
    `).all();

    const weeklyRevenue = db.prepare(`
      SELECT strftime('%Y-%W', createdAt) as name, SUM(amount) as value 
      FROM payments 
      WHERE status = 'confirmed' 
      AND createdAt >= date('now', '-12 weeks')
      GROUP BY name 
      ORDER BY name ASC
    `).all();

    const monthlyRevenue = db.prepare(`
      SELECT strftime('%Y-%m', createdAt) as name, SUM(amount) as value 
      FROM payments 
      WHERE status = 'confirmed' 
      AND createdAt >= date('now', '-12 months')
      GROUP BY name 
      ORDER BY name ASC
    `).all();

    const planDistribution = db.prepare(`
      SELECT planType as name, COUNT(*) as value 
      FROM payments 
      WHERE status = 'confirmed' 
      GROUP BY planType
    `).all();

    // Performance Analysis
    const bestSeller = db.prepare(`
      SELECT planType as name, COUNT(*) as count 
      FROM payments 
      WHERE status = 'confirmed' 
      GROUP BY planType 
      ORDER BY count DESC 
      LIMIT 1
    `).get() as any;

    const newUsersThisWeek = db.prepare("SELECT COUNT(*) as count FROM users WHERE createdAt >= date('now', '-7 days')").get() as any;

    // Growth calculation (Month over Month)
    const lastMonthStart = new Date();
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    lastMonthStart.setDate(1);
    const lastMonthEnd = new Date();
    lastMonthEnd.setDate(0); // Last day of previous month

    const currentMonthRev = monthRevenue.total || 0;
    const lastMonthRev = db.prepare("SELECT SUM(amount) as total FROM payments WHERE status = 'confirmed' AND createdAt >= ? AND createdAt <= ?").get(lastMonthStart.toISOString(), lastMonthEnd.toISOString()) as any;
    const prevMonthTotal = lastMonthRev.total || 0;
    
    const growth = prevMonthTotal > 0 ? ((currentMonthRev - prevMonthTotal) / prevMonthTotal) * 100 : 100;

    res.json({
      summary: {
        today: todayRevenue.total || 0,
        week: weekRevenue.total || 0,
        month: currentMonthRev,
        total: totalRevenue.total || 0,
        users: totalUsers.count,
        subscriptions: totalSubscriptions.count,
        confirmedPayments: confirmedPaymentsCount
      },
      charts: {
        daily: dailyRevenue,
        weekly: weeklyRevenue,
        monthly: monthlyRevenue,
        distribution: planDistribution
      },
      performance: {
        growth: Math.round(growth),
        bestSeller: bestSeller?.name || 'N/A',
        newUsers: newUsersThisWeek.count
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin routes for promo codes
app.get("/api/admin/promo-codes", authenticate, isAdmin, (req: any, res) => {
  const promos = db.prepare("SELECT * FROM promo_codes").all();
  res.json(promos);
});

app.post("/api/admin/promo-codes", authenticate, isAdmin, (req: any, res) => {
  const { code, discount, type, startDate, endDate } = req.body;
  try {
    db.prepare("INSERT INTO promo_codes (code, discount, type, startDate, endDate) VALUES (?, ?, ?, ?, ?)").run(code, discount, type || 'fixed', startDate, endDate);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Code already exists" });
  }
});

app.delete("/api/admin/promo-codes/:id", authenticate, isAdmin, (req: any, res) => {
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
  const users = db.prepare("SELECT id, email, firstName, lastName, phone, isPremium, role, status, createdAt FROM users ORDER BY createdAt DESC").all();
  res.json(users);
});

app.post("/api/admin/users/:id/ban", authenticate, isAdmin, (req, res) => {
  const userId = req.params.id;
  const user: any = db.prepare("SELECT status, role FROM users WHERE id = ?").get(userId);
  
  if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
  if (user.role === 'admin') return res.status(403).json({ error: "Impossible de bannir un administrateur" });

  const newStatus = user.status === 'banned' ? 'active' : 'banned';
  db.prepare("UPDATE users SET status = ? WHERE id = ?").run(newStatus, userId);
  
  res.json({ success: true, status: newStatus });
});

app.delete("/api/admin/users/:id", authenticate, isAdmin, (req, res) => {
  const userId = req.params.id;
  const user: any = db.prepare("SELECT role FROM users WHERE id = ?").get(userId);
  
  if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
  if (user.role === 'admin') return res.status(403).json({ error: "Impossible de supprimer un administrateur" });

  db.transaction(() => {
    db.prepare("DELETE FROM cvs WHERE userId = ?").run(userId);
    db.prepare("DELETE FROM cover_letters WHERE userId = ?").run(userId);
    db.prepare("DELETE FROM messages WHERE userId = ? OR senderId = ?").run(userId, userId);
    db.prepare("DELETE FROM invoices WHERE userId = ?").run(userId);
    db.prepare("DELETE FROM payments WHERE userId = ?").run(userId);
    db.prepare("DELETE FROM reviews WHERE userId = ?").run(userId);
    db.prepare("DELETE FROM referrals WHERE referrerId = ? OR referredUserId = ?").run(userId, userId);
    db.prepare("DELETE FROM sent_emails WHERE userId = ?").run(userId);
    db.prepare("DELETE FROM password_resets WHERE userId = ?").run(userId);
    db.prepare("DELETE FROM users WHERE id = ?").run(userId);
  })();
  
  res.json({ success: true });
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
    
    // Grant IA generations: 5 CV + 5 Letters
    db.prepare("UPDATE users SET cvGenerationsRemaining = cvGenerationsRemaining + 5, letterGenerationsRemaining = letterGenerationsRemaining + 5 WHERE id = ?").run(payment.userId);

    if (payment.planType === 'modern') {
      db.prepare("UPDATE users SET modernExpiresAt = ? WHERE id = ?").run(expiresAt, payment.userId);
    } else if (payment.planType === 'classic') {
      db.prepare("UPDATE users SET classicExpiresAt = ? WHERE id = ?").run(expiresAt, payment.userId);
    } else if (payment.planType === 'creative') {
      db.prepare("UPDATE users SET creativeExpiresAt = ? WHERE id = ?").run(expiresAt, payment.userId);
    } else {
      db.prepare("UPDATE users SET isPremium = 1 WHERE id = ?").run(payment.userId);
    }

    // Trigger Payment Confirmation Email
    sendEmail(payment.userId, "Paiement confirmé", `
      Votre paiement a été confirmé.
      Votre abonnement est maintenant actif.
      
      Merci de votre confiance !
    `);
  })();

  res.json({ success: true, message: "Paiement confirmé et abonnement activé" });
});

// --- Invoice Routes ---
app.get("/api/invoices", authenticate, (req: any, res) => {
  const invoices = db.prepare("SELECT * FROM invoices WHERE userId = ? ORDER BY createdAt DESC").all(req.user.id);
  res.json(invoices);
});

app.get("/api/admin/invoices", authenticate, isAdmin, (req, res) => {
  const invoices = db.prepare(`
    SELECT i.*, u.firstName, u.lastName, u.email 
    FROM invoices i 
    JOIN users u ON i.userId = u.id 
    ORDER BY i.createdAt DESC
  `).all();
  res.json(invoices);
});

app.post("/api/admin/payments/:id/generate-invoice", authenticate, isAdmin, (req: any, res) => {
  const paymentId = req.params.id;
  const payment = db.prepare("SELECT * FROM payments WHERE id = ?").get(paymentId) as any;
  
  if (!payment) return res.status(404).json({ error: "Paiement non trouvé" });
  if (payment.status !== 'confirmed') return res.status(400).json({ error: "Le paiement doit être confirmé avant de générer une facture" });

  const existingInvoice = db.prepare("SELECT * FROM invoices WHERE paymentId = ?").get(paymentId);
  if (existingInvoice) return res.json(existingInvoice);

  const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  const result = db.prepare(`
    INSERT INTO invoices (invoiceNumber, userId, paymentId, amount, planType) 
    VALUES (?, ?, ?, ?, ?)
  `).run(invoiceNumber, payment.userId, paymentId, payment.amount, payment.planType);

  const invoice = db.prepare("SELECT * FROM invoices WHERE id = ?").get(result.lastInsertRowid);
  
  // Trigger Invoice Email
  sendEmail(payment.userId, "Votre facture est disponible", `
    Votre facture est disponible dans votre compte utilisateur.
    Numéro de facture : ${invoiceNumber}
  `);

  res.json(invoice);
});

// --- Message Routes ---
app.get("/api/messages", authenticate, (req: any, res) => {
  const messages = db.prepare(`
    SELECT m.*, i.invoiceNumber, i.amount, i.planType, i.createdAt as invoiceDate
    FROM messages m
    LEFT JOIN invoices i ON m.invoiceId = i.id
    WHERE m.userId = ?
    ORDER BY m.createdAt DESC
  `).all(req.user.id);
  
  res.json(messages.map((m: any) => ({
    ...m,
    isRead: !!m.isRead,
    invoice: m.invoiceId ? {
      id: m.invoiceId,
      invoiceNumber: m.invoiceNumber,
      amount: m.amount,
      planType: m.planType,
      createdAt: m.invoiceDate
    } : null
  })));
});

app.post("/api/messages/:id/read", authenticate, (req: any, res) => {
  db.prepare("UPDATE messages SET isRead = 1 WHERE id = ? AND userId = ?").run(req.params.id, req.user.id);
  res.json({ success: true });
});

app.post("/api/admin/messages/send", authenticate, isAdmin, (req: any, res) => {
  const { userId, content, invoiceId } = req.body;
  
  const result = db.prepare(`
    INSERT INTO messages (userId, senderId, content, invoiceId) 
    VALUES (?, ?, ?, ?)
  `).run(userId, req.user.id, content, invoiceId || null);

  res.json({ success: true, messageId: result.lastInsertRowid });
});

// --- Review Routes ---
app.get("/api/reviews", (req, res) => {
  const reviews = db.prepare(`
    SELECT r.*, u.firstName, u.lastName 
    FROM reviews r 
    JOIN users u ON r.userId = u.id 
    WHERE r.isApproved = 1 
    ORDER BY r.createdAt DESC
  `).all();
  
  const stats = db.prepare("SELECT AVG(rating) as avgRating, COUNT(*) as totalReviews FROM reviews WHERE isApproved = 1").get() as any;
  
  res.json({
    reviews,
    avgRating: Math.round((stats.avgRating || 0) * 10) / 10,
    totalReviews: stats.totalReviews || 0
  });
});

app.post("/api/reviews", authenticate, (req: any, res) => {
  const { rating, content } = req.body;
  if (!rating || !content) return res.status(400).json({ error: "Rating and content are required" });
  
  db.prepare("INSERT INTO reviews (userId, rating, content) VALUES (?, ?, ?)").run(req.user.id, rating, content);
  res.json({ success: true, message: "Avis envoyé pour modération" });
});

// --- Admin Review & Email History Routes ---
app.get("/api/admin/reviews", authenticate, isAdmin, (req, res) => {
  const reviews = db.prepare(`
    SELECT r.*, u.firstName, u.lastName, u.email 
    FROM reviews r 
    JOIN users u ON r.userId = u.id 
    ORDER BY r.createdAt DESC
  `).all();
  res.json(reviews);
});

app.patch("/api/admin/reviews/:id/approve", authenticate, isAdmin, (req, res) => {
  db.prepare("UPDATE reviews SET isApproved = 1 WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

app.delete("/api/admin/reviews/:id", authenticate, isAdmin, (req, res) => {
  db.prepare("DELETE FROM reviews WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

app.get("/api/admin/emails", authenticate, isAdmin, (req, res) => {
  const emails = db.prepare(`
    SELECT e.*, u.firstName, u.lastName, u.email 
    FROM sent_emails e 
    JOIN users u ON e.userId = u.id 
    ORDER BY e.sentAt DESC
  `).all();
  res.json(emails);
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

  // API 404 Handler
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `Route API non trouvée: ${req.method} ${req.url}` });
  });

  // Global Error Handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Global Error Handler:", err);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({ 
      error: err.message || "Internal server error",
      path: req.url
    });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
