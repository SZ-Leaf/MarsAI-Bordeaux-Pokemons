// src/config/db_pool.js
import mysql from 'mysql2/promise';
import env from './db_config.js';

const pool = mysql.createPool({
   host: env.DB_HOST,
   port: env.DB_PORT,
   user: env.DB_USER,
   password: env.DB_PASSWORD,
   database: env.DB_NAME,
   connectionLimit: 5,
});

const testConnection = async () => {
   try {
      const [rows] = await pool.query("SELECT NOW() AS NOW");
      console.log('DB connected, time:', rows[0].NOW);
   } catch (error) {
      console.error("DB ERROR:", error);
      throw new Error(error.message);
   }
};


export default {
   pool,
   testConnection
};
