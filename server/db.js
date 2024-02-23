// In db.js
const { Pool } = require("pg");
require("dotenv").config(); // Add the parentheses to invoke the config method

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
 connectionString
});

module.exports = pool;

