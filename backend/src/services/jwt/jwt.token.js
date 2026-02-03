import jwt from "jsonwebtoken";
import env from "../../config/db_config.js";

const signToken = (payload) => {
   return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "24h" });
}

const verifyToken = (token) => {
   return jwt.verify(token, env.JWT_SECRET);
}

export { signToken, verifyToken };