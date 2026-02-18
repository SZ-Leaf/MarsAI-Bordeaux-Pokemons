/**
 * Composant affichant le message de succès après soumission
 * Les données viennent de l'API dans response.data (submission_id, duration_seconds)
 */
const SubmissionSuccess = ({ submitSuccess, onReset }) => {
  const data = submitSuccess?.data ?? submitSuccess;
  const submissionId = data?.submission_id;
  const durationSeconds = data?.duration_seconds;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="alert alert-success text-center">
        <h2 className="alert-success-title alert-success-text">
          Soumission réussie !
        </h2>
        <p className="alert-success-text mb-4">
          Votre film a été soumis avec succès.
        </p>
        {submissionId != null && (
          <p className="text-sm text-gray-600 mb-4">
            ID de soumission : {submissionId}
          </p>
        )}
        {durationSeconds != null && (
          <p className="text-sm text-gray-600 mb-4">
            Durée : {Math.floor(durationSeconds / 60)}min {durationSeconds % 60}sec
          </p>
        )}
        <button
          onClick={onReset}
          className="btn btn-primary"
        >
          Soumettre un autre film
        </button>
      </div>
    </div>
  );
};

export default SubmissionSuccess;
