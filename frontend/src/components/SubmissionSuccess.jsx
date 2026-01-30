/**
 * Composant affichant le message de succès après soumission
 */
const SubmissionSuccess = ({ submitSuccess, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-green-50 border border-green-500 rounded p-6 text-center">
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          Soumission réussie !
        </h2>
        <p className="text-green-700 mb-4">
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
          className="bg-blue-500 text-white px-6 py-2 rounded"
        >
          Soumettre un autre film
        </button>
      </div>
    </div>
  );
};

export default SubmissionSuccess;
