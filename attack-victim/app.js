const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
const db = new sqlite3.Database(":memory:");

// Create a simple users table and verify its creation
db.serialize(() => {
  // Create table
  db.run(
    "CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)",
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("Table 'users' created successfully.");
      }
    }
  );

  // Insert sample data
  db.run(
    "INSERT INTO users (username, password) VALUES ('admin', 'password123')"
  );
  db.run("INSERT INTO users (username, password) VALUES ('user', '12345')");

  // Verify table and data creation
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      console.error("Error fetching data:", err.message);
    } else {
      console.log("Users table data:", rows);
    }
  });
});

// Vulnerable endpoint
app.get("/user", (req, res) => {
  const id = req.query.id; // Vulnerable: No input sanitization
  const query = `SELECT * FROM users WHERE id = ${id}`;

  console.log("Executing Query:", query);
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error:", err.message);
      return res.status(500).send("Database error");
    }
    res.json(rows);
  });
});

app.listen(3000, () => {
  console.log("Vulnerable app running on http://localhost:3000");
});
