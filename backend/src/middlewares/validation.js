<<<<<<< feature-06-admin-moderation
import { ZodError } from "zod";
=======
import {ZodError} from "zod";
>>>>>>> main
import { sendError } from "../helpers/response.helper.js";

export const validate = (schema) => (req, res, next) => {
  try {
    console.log(req.body)
    const data = schema.parse(req.body);

    req.body = data;

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      console.log(err.errors);
      return sendError(
        res,
        400,
        "Erreur de validation",
        "Validation error",
        err.errors
      );
    }
    next(err);
  }
};
