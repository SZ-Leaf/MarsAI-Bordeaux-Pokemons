import db from "../../config/db_pool.js";

const getAllAwards = async() => {
    const [rows] = await db.pool.execute(
        "SELECT id, title, award_rank, cover, description, submission_id FROM awards ORDER BY award_rank ASC"
    );
    return rows;
};

const getAwardById = async(id) => {
    const [rows] = await db.pool.execute(
        "SELECT id, title, award_rank, cover, description, created_at, submission_id FROM awards WHERE id = ?", [id]
    );
    return rows[0];
};
const createAward = async ({
  title,
  award_rank,
  submission_id = null,
  cover = null,
  description = null,
}) => {
  const [result] = await db.pool.execute(
    `INSERT INTO awards (title, award_rank, submission_id, cover, description)
     VALUES (?, ?, ?, ?, ?)`,
    [
      title ?? null,
      award_rank ?? null,
      submission_id ?? null,
      cover ?? null,
      description ?? null,
    ]
  );

  return { id: result.insertId };
};
const updateAward = async (
  id,
  { title, award_rank, submission_id = null, cover, description }
) => {
  const [result] = await db.pool.execute(
    `UPDATE awards
     SET title = ?, award_rank = ?, submission_id = ?, cover = ?, description = ?
     WHERE id = ?`,
    [title, award_rank, submission_id, cover, description, id]
  );

  return result;
};
const deleteAward = async (id) => {
  const [result] = await db.pool.execute(
    "DELETE FROM awards WHERE id = ?",
    [id]
  );
  return result;
};
const getUnassignedAwards = async () => {
  const [rows] = await db.pool.execute(
    `SELECT id, title, award_rank, description
     FROM awards
     WHERE submission_id IS NULL
     ORDER BY award_rank ASC`
  );
  return rows;
};
const setAwardSubmission = async (awardId, submissionId) => {
  const [result] = await db.pool.execute(
    `UPDATE awards
     SET submission_id = ?
     WHERE id = ?`,
    [submissionId, awardId]
  );

  return result;
};
const getAwardsBySubmissionId = async (submissionId) => {
  const [rows] = await db.pool.execute(
    `SELECT id, title, award_rank, cover, description
     FROM awards
     WHERE submission_id = ?
     ORDER BY award_rank ASC`,
    [submissionId]
  );
  return rows;
};

export default {getAllAwards, getAwardById, createAward, updateAward, deleteAward, getUnassignedAwards, setAwardSubmission, getAwardsBySubmissionId}