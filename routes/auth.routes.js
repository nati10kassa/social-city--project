// routes/auth.routes.js
// התחברות, הרשמה והתנתקות

const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db/db");

const router = express.Router();

// ==========================
// הגדרת אדמין קבוע
// ==========================
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// ==========================
// POST - Login
// ==========================
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // ===== התחברות אדמין =====
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.user = {
      id: 0,
      username: "admin",
      role: "admin"
    };

    return res.json({
      success: true,
      message: "Admin logged in"
    });
  }

  // ===== התחברות משתמש רגיל =====
  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], async (err, results) => {
    if (err) return res.status(500).json({ success: false });

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "שם משתמש או סיסמה שגויים"
      });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "שם משתמש או סיסמה שגויים"
      });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      role: "user"
    };

    res.json({ success: true });
  });
});

// ==========================
// POST - Register
// ==========================
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // חסימת רישום אדמין
  if (username === ADMIN_USERNAME) {
    return res.status(403).json({
      success: false,
      message: "שם משתמש שמור למערכת"
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(sql, [username, hashedPassword], err => {
      if (err) {
        return res.status(409).json({
          success: false,
          message: "שם משתמש כבר קיים"
        });
      }

      res.json({ success: true });
    });
  } catch {
    res.status(500).json({ success: false });
  }
});

// ==========================
// GET - Logout
// ==========================
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
