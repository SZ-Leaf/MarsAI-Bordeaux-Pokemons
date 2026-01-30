import bcrypt from "bcrypt";

const saltRounds = 10;
async function hashPassword(password, rounds = saltRounds) {
   password = password?.trim();
   if (!password) throw new Error("Password is required");

   try {
      return await bcrypt.hash(password, rounds);
   } catch (error) {
      console.error("Error hashing password:", error);
      throw new Error(error.message);
   }
}

async function verifyPassword(password, hash) {
   password = password?.trim();
   if (!password)throw new Error("Password is required");
   if (!hash) throw new Error("Hash is required");
   
   try {
      return await bcrypt.compare(password, hash);
   } catch (error) {
      console.error("Error verifying password:", error);
      throw new Error(error.message);
   }
}

export { hashPassword, verifyPassword };