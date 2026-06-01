// =======================================
// MySQL Connection
// =======================================

const mysql = require("mysql2");

// יצירת חיבור
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", 
  database: "city_social"
});

// בדיקת חיבור
pool.getConnection((err, connection) => {
  if (err) {
    console.error(" MySQL connection failed:", err);
  } else {
    console.log(" Connected to MySQL");
    connection.release();
  }
});

module.exports = pool;
