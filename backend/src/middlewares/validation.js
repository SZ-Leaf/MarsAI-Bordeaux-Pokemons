import {ZodError} from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    const data = schema.parse(req.body);

    req.body = data;

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const flat = err.flatten();
      return res.status(400).json({
        success: false,
        message: "Erreur de validation",
        errors: flat.fieldErrors,
      });
    }
    next(err);
  }
};
