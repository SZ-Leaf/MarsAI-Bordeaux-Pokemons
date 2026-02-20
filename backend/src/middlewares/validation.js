import {ZodError} from "zod";
import { sendError } from "../helpers/response.helper.js";
import fs from 'fs';

//permet la suppression des fichers uploadés(cover, par ex) si erreur de validation
const cleanupUploads = (req) => {
  if (req.file?.path) fs.unlink(req.file.path, () => {});
  if (req.files && typeof req.files === "object") {
    for (const arr of Object.values(req.files)) {
      for (const f of arr || []) {
        if (f?.path) fs.unlink(f.path, () => {});
      }
    }
  }
};

export const validate = (schema) => (req, res, next) => {
  try {
    console.log(req.body)
    const data = schema.parse(req.body);

    req.body = data;

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      cleanupUploads(req);
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
