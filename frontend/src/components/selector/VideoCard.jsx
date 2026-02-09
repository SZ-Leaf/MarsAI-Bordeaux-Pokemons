import { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const VideoCard = ({ submission, isActive }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);
  // toggle du play/pause (mobilefirst)
  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // toggle du mute/unmute (mobilefirst)
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {/* Vidéo */}
      <video
        ref={videoRef}
        src={submission.video_url}
        className="h-full w-full object-contain"
        loop
        muted={isMuted}
        playsInline
        onClick={togglePlay}
      />

      {/* Informations de la vidéo */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        <h2 className="text-white text-2xl font-bold mb-2">
          {submission.english_title}
        </h2>
        <p className="text-white/90 text-sm line-clamp-2">
          {submission.english_synopsis}
        </p>
        <div className="flex gap-2 mt-3">
          {submission.tags?.map(tag => (
            <span 
              key={tag.id}
              className="px-2 py-1 bg-white/20 rounded text-white text-xs"
            >
              #{tag.title}
            </span>
          ))}
        </div>
      </div>

      {/* Contrôles */}
      <button
        onClick={toggleMute}
        className="absolute top-6 right-6 p-3 bg-black/50 rounded-full text-white"
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      {/* Indicateur pause */}
      {!isPlaying && isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/50 rounded-full p-6">
            <Play size={48} className="text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCard;