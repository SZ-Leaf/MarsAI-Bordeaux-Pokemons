import {ZodError} from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    const data = schema.parse(req.body);

    req.body = data;

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      // const flat = err.flatten();
      console.log(err.errors);
      return sendError(res, 400,
        "Erreur de validation",
        "Validation error",
        err.errors);
    }
    next(err);
  }
};
