// src/services/jury.service.js
import { apiCall } from "../utils/api";
import { jurySchema } from "@marsai/schemas";
export { zodFieldErrors } from "../utils/validation";

const BASE = "/api/jury";

// Normalise la cover en URL publique utilisable par <img src="...">
export const juryCoverUrl = (cover) => {
  if (!cover) return null;
  const normalized = String(cover).replace(/^\/+/, ""); // enlève slash éventuel
  return `/${normalized}`; // -> /uploads/...
};

export const juryService = {
  // GET /api/jury
  list(params = {}) {
    // params optionnels: search, limit, offset... si tu en ajoutes plus tard
    return apiCall(BASE, { params });
  },

  // GET /api/jury/:id
  getById(id) {
    return apiCall(`${BASE}/${id}`);
  },

  // POST /api/jury
  create({ firstname, lastname, job, coverFile } = {}) {
    // Validation Zod côté client (sans cover)
    jurySchema.parse({ firstname, lastname, job });

    const fd = new FormData();
    if (coverFile) fd.append("cover", coverFile);
    fd.append("firstname", firstname ?? "");
    fd.append("lastname", lastname ?? "");
    fd.append("job", job ?? "");

    return apiCall(BASE, {
      method: "POST",
      body: fd,
    });
  },

  // PUT /api/jury/:id 
  update(id, { firstname, lastname, job, coverFile } = {}) {
    // si tu veux autoriser update sans cover => on peut envoyer JSON
    // mais le plus simple: envoyer FormData dans tous les cas
    const fd = new FormData();
    if (coverFile) fd.append("cover", coverFile);
    fd.append("firstname", firstname ?? "");
    fd.append("lastname", lastname ?? "");
    fd.append("job", job ?? "");

    return apiCall(`${BASE}/${id}`, {
      method: "PUT",
      body: fd,
    });
  },

  // DELETE /api/jury/:id
  remove(id) {
    return apiCall(`${BASE}/${id}`, { method: "DELETE" });
  },
};