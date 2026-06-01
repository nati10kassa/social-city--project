// routes/posts.routes.js
// Router לטיפול בפוסטים

const express = require("express");
const db = require("../db/db");

const router = express.Router();

// ==========================
// Middleware - בדיקת התחברות
// ==========================
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
}

// ==========================
// GET - כל הפוסטים
// ==========================
router.get("/", requireLogin, (req, res) => {
  const sql = `
    SELECT p.*, COUNT(l.id) AS likes
    FROM posts p
    LEFT JOIN likes l ON p.id = l.post_id
    GROUP BY p.id
    ORDER BY p.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false });
    res.json(results);
  });
});

// ==========================
// POST - הוספת פוסט
// ==========================
router.post("/", requireLogin, (req, res) => {
  const { title, content } = req.body;

  const sql = "INSERT INTO posts (title, content) VALUES (?, ?)";
  db.query(sql, [title, content], err => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
});

// ==========================
// DELETE - מחיקת פוסט (Admin)
// ==========================
router.delete("/:id", requireLogin, requireAdmin, (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM posts WHERE id = ?", [id], err => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
});

// ==========================
// POST - Like לפוסט
// ==========================
router.post("/:id/like", requireLogin, (req, res) => {
  const postId = req.params.id;
  const userId = req.session.user.id;

  const sql = "INSERT INTO likes (user_id, post_id) VALUES (?, ?)";
  db.query(sql, [userId, postId], err => {
    if (err) return res.status(409).json({ message: "כבר עשית לייק" });
    res.json({ success: true });
  });
});

module.exports = router;
