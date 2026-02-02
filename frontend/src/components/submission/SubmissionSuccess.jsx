/**
 * Composant affichant le message de succès après soumission
 */
const SubmissionSuccess = ({ submitSuccess, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="alert alert-success text-center">
        <h2 className="alert-success-title alert-success-text">
          Soumission réussie !
        </h2>
        <p className="alert-success-text mb-4">
          Votre film a été soumis avec succès.
        </p>
        <p className="text-sm text-gray-600 mb-4">
          ID de soumission : {submitSuccess.submission_id}
        </p>
        {submitSuccess.duration_seconds && (
          <p className="text-sm text-gray-600 mb-4">
            Durée : {Math.floor(submitSuccess.duration_seconds / 60)}min {submitSuccess.duration_seconds % 60}sec
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
