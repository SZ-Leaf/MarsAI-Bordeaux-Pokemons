import VideoActions from './VideoActions';

const VideoInfosDesktop = ({ submission, addToPlaylist, rateSubmission, selection, toggle, hasRating, markAsRated }) => {
  return (
    <div className="mt-6 mb-8 text-white">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">
            {submission.english_title}
          </h1>
          <p className="text-white/70 text-base">
            {submission.english_synopsis}
          </p>
        </div>
        
        <VideoActions 
          submission={submission}
          addToPlaylist={addToPlaylist}
          rateSubmission={rateSubmission}
          selection={selection}
          toggle={toggle}
          hasRating={hasRating}
          markAsRated={markAsRated}
        />
      </div>

      {submission.tags && submission.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {submission.tags.map(tag => (
            <span
              key={tag.id}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition"
            >
              #{tag.title}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-white/5 rounded-lg p-4">
          <span className="text-white/50 block mb-1">Durée</span>
          <span className="text-white font-semibold">{submission.duration || 'N/A'}</span>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <span className="text-white/50 block mb-1">Catégorie</span>
          <span className="text-white font-semibold">{submission.category || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoInfosDesktop;
