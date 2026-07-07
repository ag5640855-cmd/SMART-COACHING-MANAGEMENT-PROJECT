/*const mysql = require("mysql2");
console.log("HOST: ", process.env.DB_HOST);
console.log("PORT: ", process.env.DB_PORT);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.log("Database Connection Failed");
    console.log(err);
  } else {
    console.log("MySQL Connected Successfully");
  }
});

module.exports = db;*/

/*const mysql = require("mysql2");
require("dotenv").config(); // Yeh line add karna bahut zaroori hai!

console.log("HOST: ", process.env.DB_HOST);
console.log("PORT: ", process.env.DB_PORT);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false // Aiven cloud connection ke liye ye compulsory hai
  }
});

db.connect((err) => {
  if (err) {
    console.log("Database Connection Failed");
    console.log(err);
  } else {
    console.log("MySQL Connected Successfully");
  }
});

module.exports = db;*/

const mysql = require("mysql2");
require("dotenv").config();

console.log("HOST: ", process.env.DB_HOST);
console.log("PORT: ", process.env.DB_PORT);

const db = mysql.createPool({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    port: process.env.DB_PORT,

    ssl: {
        rejectUnauthorized: false
    },

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0

});


db.getConnection((err, connection) => {

    if (err) {

        console.log("Database Connection Failed");
        console.log(err);

    } else {

        console.log("MySQL Connected Successfully");
        connection.release();

    }

});


module.exports = db;