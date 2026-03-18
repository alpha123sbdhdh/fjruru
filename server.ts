import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";
import Database from "better-sqlite3";
import crypto from "crypto";

const PORT = 3000;

const db = new Database("app.db");

// Initialize DB schema
const initDb = () => {
  // Check if users table exists and has email column
  let shouldRecreateUsers = false;
  try {
    const columns = db.prepare("PRAGMA table_info(users)").all() as any[];
    if (columns.length > 0) {
      const columnNames = columns.map(c => c.name);
      if (!columnNames.includes('email')) {
        console.log("Detected old users table schema. Recreating...");
        shouldRecreateUsers = true;
      }
    }
  } catch (err) {
    console.log("Error checking schema, assuming fresh start");
  }

  if (shouldRecreateUsers) {
    db.prepare("DROP TABLE IF EXISTS users").run();
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      password_hash TEXT,
      salt TEXT,
      avatar TEXT,
      bio TEXT,
      status TEXT DEFAULT 'online',
      role TEXT DEFAULT 'Recruit'
    );

    CREATE TABLE IF NOT EXISTS channels (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      category_id TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      channel_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY(channel_id) REFERENCES channels(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      section TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS channel_notifications (
      user_id TEXT NOT NULL,
      channel_id TEXT NOT NULL,
      is_muted BOOLEAN DEFAULT 0,
      PRIMARY KEY (user_id, channel_id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(channel_id) REFERENCES channels(id)
    );

    CREATE TABLE IF NOT EXISTS channel_mutes (
      user_id TEXT NOT NULL,
      channel_id TEXT NOT NULL,
      expires_at TEXT,
      PRIMARY KEY (user_id, channel_id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(channel_id) REFERENCES channels(id)
    );

    CREATE TABLE IF NOT EXISTS channel_kicks (
      user_id TEXT NOT NULL,
      channel_id TEXT NOT NULL,
      PRIMARY KEY (user_id, channel_id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(channel_id) REFERENCES channels(id)
    );

    CREATE TABLE IF NOT EXISTS user_warnings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      admin_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(admin_id) REFERENCES users(id)
    );
  `);
};

initDb();

// Insert initial data if empty
const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
if (categoryCount.count === 0) {
  const insertCategory = db.prepare("INSERT INTO categories (id, name, section) VALUES (?, ?, ?)");
  insertCategory.run("cat-1", "General", "community");
  insertCategory.run("cat-2", "Projects", "community");

  const insertChannel = db.prepare("INSERT INTO channels (id, name, type, category_id) VALUES (?, ?, ?, ?)");
  insertChannel.run("ch-1", "general", "text", "cat-1");
  insertChannel.run("ch-2", "announcements", "announcement", "cat-1");
  insertChannel.run("ch-3", "project-ideas", "text", "cat-2");
}

// Ensure AI user exists
const aiUserCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE id = 'ai'").get() as { count: number };
if (aiUserCount.count === 0) {
  db.prepare("INSERT INTO users (id, username, avatar) VALUES (?, ?, ?)").run(
    "ai",
    "THE GENERAL",
    "https://ui-avatars.com/api/?name=TG&background=D4AF37&color=000&bold=true"
  );
}

// Helper for hashing
function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

function verifyPassword(password: string, salt: string, hash: string) {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  app.use(express.json());


  // API Routes
  app.get("/api/state", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
    const channels = db.prepare("SELECT * FROM channels").all();
    const users = db.prepare("SELECT id, username, avatar, status, bio, role FROM users").all();
    
    res.json({ categories, channels, users });
  });

  app.get("/api/messages/:channelId", (req, res) => {
    const messages = db.prepare(`
      SELECT m.*, u.username, u.avatar 
      FROM messages m 
      JOIN users u ON m.user_id = u.id 
      WHERE m.channel_id = ? 
      ORDER BY m.timestamp ASC
    `).all(req.params.channelId);
    res.json(messages);
  });

  app.get("/api/notifications/:userId", (req, res) => {
    const settings = db.prepare("SELECT * FROM channel_notifications WHERE user_id = ?").all(req.params.userId);
    res.json(settings);
  });

  app.post("/api/notifications", (req, res) => {
    const { userId, channelId, isMuted } = req.body;
    db.prepare(`
      INSERT INTO channel_notifications (user_id, channel_id, is_muted) 
      VALUES (?, ?, ?) 
      ON CONFLICT(user_id, channel_id) 
      DO UPDATE SET is_muted = excluded.is_muted
    `).run(userId, channelId, isMuted ? 1 : 0);
    res.json({ success: true });
  });

  app.post("/api/signup", (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: "All fields required" });
  
    try {
      const { salt, hash } = hashPassword(password);
      const id = "usr-" + Math.random().toString(36).substr(2, 9);
      
      // Check if this is the first real user
      const userCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE id != 'ai'").get() as { count: number };
      const initialRole = userCount.count === 0 ? 'Admin' : (role || 'Recruit');

      db.prepare("INSERT INTO users (id, username, email, password_hash, salt, avatar, role) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
        id, username, email, hash, salt, 
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        initialRole
      );
      
      const user = db.prepare("SELECT id, username, email, avatar, status, bio, role FROM users WHERE id = ?").get(id);
      res.json(user);
    } catch (err: any) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: "Username or email already exists" });
      }
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    
    if (!user || !user.password_hash) {
       return res.status(401).json({ error: "Invalid credentials" });
    }
    
    if (verifyPassword(password, user.salt, user.password_hash)) {
      const { password_hash, salt, ...safeUser } = user;
      res.json(safeUser);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/user/update-profile", (req, res) => {
    const { userId, username, bio, avatar } = req.body;
    
    try {
      db.prepare("UPDATE users SET username = ?, bio = ?, avatar = ? WHERE id = ?").run(
        username, bio, avatar, userId
      );
      
      const user = db.prepare("SELECT id, username, email, avatar, status, bio, role FROM users WHERE id = ?").get(userId);
      res.json(user);
    } catch (err: any) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: "Username already exists" });
      }
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Moderation APIs
  app.post("/api/admin/mute", (req, res) => {
    const { adminId, userId, channelId, expiresAt } = req.body;
    const admin = db.prepare("SELECT role FROM users WHERE id = ?").get(adminId) as any;
    if (!admin || !['Admin', 'General', 'Officer'].includes(admin.role)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    db.prepare(`
      INSERT INTO channel_mutes (user_id, channel_id, expires_at) 
      VALUES (?, ?, ?) 
      ON CONFLICT(user_id, channel_id) 
      DO UPDATE SET expires_at = excluded.expires_at
    `).run(userId, channelId, expiresAt || null);

    res.json({ success: true });
  });

  app.post("/api/admin/unmute", (req, res) => {
    const { adminId, userId, channelId } = req.body;
    const admin = db.prepare("SELECT role FROM users WHERE id = ?").get(adminId) as any;
    if (!admin || !['Admin', 'General', 'Officer'].includes(admin.role)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    db.prepare("DELETE FROM channel_mutes WHERE user_id = ? AND channel_id = ?").run(userId, channelId);
    res.json({ success: true });
  });

  app.post("/api/admin/kick", (req, res) => {
    const { adminId, userId, channelId } = req.body;
    const admin = db.prepare("SELECT role FROM users WHERE id = ?").get(adminId) as any;
    if (!admin || !['Admin', 'General', 'Officer'].includes(admin.role)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    db.prepare("INSERT OR IGNORE INTO channel_kicks (user_id, channel_id) VALUES (?, ?)").run(userId, channelId);
    res.json({ success: true });
  });

  app.post("/api/admin/warn", (req, res) => {
    const { adminId, userId, reason } = req.body;
    const admin = db.prepare("SELECT role FROM users WHERE id = ?").get(adminId) as any;
    if (!admin || !['Admin', 'General', 'Officer'].includes(admin.role)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const id = "warn-" + Math.random().toString(36).substr(2, 9);
    db.prepare("INSERT INTO user_warnings (id, user_id, admin_id, reason, timestamp) VALUES (?, ?, ?, ?, ?)").run(
      id, userId, adminId, reason, new Date().toISOString()
    );

    res.json({ success: true });
  });

  app.post("/api/admin/update-role", (req, res) => {
    const { adminId, userId, newRole } = req.body;
    const admin = db.prepare("SELECT role FROM users WHERE id = ?").get(adminId) as any;
    
    // Only Admin, General or Co-Admin can change roles
    if (!admin || !['Admin', 'General', 'Co-Admin'].includes(admin.role)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Prevent downgrading the main General if we had one, but for now just allow it
    db.prepare("UPDATE users SET role = ? WHERE id = ?").run(newRole, userId);
    
    res.json({ success: true });
  });

  app.get("/api/moderation/status/:channelId/:userId", (req, res) => {
    const { channelId, userId } = req.params;
    const mute = db.prepare("SELECT * FROM channel_mutes WHERE user_id = ? AND channel_id = ?").get(userId, channelId) as any;
    const kick = db.prepare("SELECT * FROM channel_kicks WHERE user_id = ? AND channel_id = ?").get(userId, channelId) as any;
    const warnings = db.prepare("SELECT * FROM user_warnings WHERE user_id = ?").all(userId);

    res.json({
      isMuted: !!mute && (!mute.expires_at || new Date(mute.expires_at) > new Date()),
      isKicked: !!kick,
      warnings
    });
  });

  // Socket.io
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join_channel", (channelId) => {
      socket.join(channelId);
    });

    socket.on("leave_channel", (channelId) => {
      socket.leave(channelId);
    });

    socket.on("send_message", (data) => {
      const { channelId, userId, content, id: clientId } = data;

      // Check if muted
      const mute = db.prepare("SELECT * FROM channel_mutes WHERE user_id = ? AND channel_id = ?").get(userId, channelId) as any;
      if (mute && (!mute.expires_at || new Date(mute.expires_at) > new Date())) {
        return socket.emit("error", { message: "You are muted in this channel." });
      }

      const id = clientId || "msg-" + Math.random().toString(36).substr(2, 9);
      const timestamp = new Date().toISOString();
      
      db.prepare("INSERT INTO messages (id, channel_id, user_id, content, timestamp) VALUES (?, ?, ?, ?, ?)").run(
        id, channelId, userId, content, timestamp
      );
      
      const message = db.prepare(`
        SELECT m.*, u.username, u.avatar 
        FROM messages m 
        JOIN users u ON m.user_id = u.id 
        WHERE m.id = ?
      `).get(id);

      io.to(channelId).emit("new_message", message);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*all", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
