import pool from '../../config/db_pool.js';

const getRoles = async () => {
   try {
      const [rows] = await pool.execute("SELECT * FROM roles");
      return rows;
   } catch (error) {
      console.error("Error getting roles:", error);
      throw new Error(error.message);
   }
};

const getRoleById = async (id) => {
   try {
      const [rows] = await pool.execute("SELECT * FROM roles WHERE id = ?", [id]);
      return rows[0];
   } catch (error) {
      console.error("Error getting role by id:", error);
      throw new Error(error.message);
   }
}

export default {
   getRoles,
   getRoleById
};