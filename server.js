// =======================================
// City Social - Backend Server
// Developers: Naorai Rabinovich & Netanel Kssa
// =======================================

const express = require("express");
const session = require("express-session");
const db = require("./db/db");

// Routers
const authRoutes = require("./routes/auth.routes");
const postsRoutes = require("./routes/posts.routes");

const app = express();
const PORT = 3000;

// ==========================
// Middlewares
// ==========================
app.use(express.json());

app.use(
  session({
    secret: "city-social-secret",
    resave: false,
    saveUninitialized: false
  })
);

// Frontend
app.use(express.static("public"));
// ==========================
// Route: Current Logged User
// ==========================
app.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.json({
      loggedIn: false
    });
  }

  res.json({
    loggedIn: true,
    user: req.session.user
  });
});

// ==========================
// Routes
// ==========================
app.use("/", authRoutes);
app.use("/posts", postsRoutes);

// ==========================
// Start Server
// ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
