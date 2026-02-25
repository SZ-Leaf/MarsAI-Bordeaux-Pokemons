import { apiCall } from "../utils/api";

// LIST
export const getAwardsService = async () => {
  return apiCall("/api/awards", { method: "GET" });
};

export const getAwardByIdService = async (awardId) => {
  return apiCall(`/api/awards/${awardId}`, { method: "GET" });
};

export const getUnassignedAwardsService = async () => {
  // adapte si ta route est /unassign
  return apiCall("/api/awards/unassign", { method: "GET" });
};

export const getAwardsBySubmissionService = async (submissionId) => {
  // adapte si ta route est /by_submission/:submissionId
  return apiCall(`/api/awards/by_submission/${submissionId}`, { method: "GET" });
};

// CREATE (multipart) -> formData
export const createAwardService = async (formData) => {
  return apiCall("/api/awards", {
    method: "POST",
    body: formData,
  });
};

// UPDATE (multipart) -> formData
export const updateAwardService = async (awardId, formData) => {
  return apiCall(`/api/awards/${awardId}`, {
    method: "PUT",
    body: formData,
  });
};

// DELETE
export const deleteAwardService = async (awardId) => {
  return apiCall(`/api/awards/${awardId}`, {
    method: "DELETE",
  });
};

// SET SUBMISSION (JSON)
export const setAwardSubmissionService = async (awardId, submission_id) => {
  return apiCall(`/api/awards/${awardId}/submission`, {
    method: "PUT",
    body: { submission_id }, // apiCall doit gérer JSON stringify
  });
};