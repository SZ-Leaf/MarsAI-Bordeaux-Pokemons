import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.JWT_SECRET);


export default {
   PORT : process.env.PORT,
   DB_HOST : process.env.DB_HOST,
   DB_NAME : process.env.DB_NAME,
   DB_USER : process.env.DB_USER,
   DB_PASSWORD : process.env.DB_PASSWORD,
   DB_PORT : process.env.DB_PORT,
   JWT_SECRET: process.env.JWT_SECRET
}
