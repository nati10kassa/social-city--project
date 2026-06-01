const bcrypt = require("bcrypt");
const db = require("./db/db");

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const sql = `
    INSERT INTO users (username, password, role)
    VALUES (?, ?, ?)
  `;

  db.query(sql, ["admin", hashedPassword, "admin"], (err) => {
    if (err) {
      console.error("❌ Admin already exists or error:", err.message);
    } else {
      console.log("✅ Admin user created successfully");
    }
    process.exit();
  });
}

createAdmin();
