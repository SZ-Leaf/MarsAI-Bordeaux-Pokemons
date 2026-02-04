import { verifyToken } from "../services/jwt/jwt.token.js";
import { sendError } from "../helpers/response.helper.js";

export const authenticate = async (req, res, next) => {
   try {
      // get token from cookies
      const token = req.cookies?.authToken;
      if(!token) {
         return sendError(res, 401,
            "Session invalide",
            "Invalid session",
            null
         );
      }
      // verify token
      const decoded = verifyToken(token);

      req.user = {
         id: decoded.sub,
         email: decoded.email,
         role_id: decoded.role_id,
      }
      next();
   } catch (error) {
      console.error("Error authenticating user:", error);
      return sendError(res, 401,
         "Session invalide",
         "Invalid session",
      );
   }
}

export const requireRole = (roles) => {
   return (req, res, next) => {
      if(!req.user) {
         return sendError(res, 401,
            "Non authentifié",
            "Not authenticated",
            null
         );
      }

      if(!roles.includes(req.user.role_id)) {
         return sendError(res, 403,
            "Accès refusé",
            "Access denied",
            null
         );
      }
      next();
   }
}