const mysql = require('mysql2/promise'); //Loads the MariaDB/MySQL driver
require('dotenv').config(); //Reads your .env file so the credentials load

const pool = mysql.createPool({      // Creates a pool of reusable DB connections
  host: process.env.DB_HOST,         // localhost
  port: process.env.DB_PORT,         // 3306
  user: process.env.DB_USER,         // root
  password: process.env.DB_PASSWORD, // your mariadb password
  database: process.env.DB_NAME,     // sokometrics
});

module.exports = pool;  //Makes the pool available to every controller that imports it