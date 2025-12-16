require('dotenv').config();
const app = require('./app');
const db = require('./config/database');

const PORT = process.env.PORT || 3000;

// Test DB Connection
db.getConnection()
  .then(conn => {
    console.log("Database Connected Successfully");
    conn.release();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Database Connection Failed:", err);
  });