import { useRef, useEffect, useState } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import VideoInfosDesktop from './VideoInfosDesktop';

const VideoCard = ({ submission, isActive, addToPlaylist, rateSubmission, selection, toggle, hasRating, markAsRated }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    const video_url = submission.video_url?.startsWith('http')
        ? submission.video_url
        : `${API_URL}${submission.video_url}`;

    useEffect(() => {
        if (isActive && videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        } else if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    }, [isActive]);
    // toggle du play/pause
    const togglePlay = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    // toggle du mute/unmute
    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    return (
        <>
            <div className="relative h-full w-full flex items-center justify-center md:hidden">
                <div className="w-full aspect-video bg-black">
                    <video
                        ref={videoRef}
                        src={video_url}
                        className="h-full w-full object-cover"
                        loop
                        muted={isMuted}
                        playsInline
                        onClick={togglePlay}
                    />
                </div>
            </div>
            {/* Informations de la vidéo avec boutons d'action */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/80 to-transparent pointer-events-none">
                {/* Titre et boutons d'action */}
                <div className="flex items-start justify-between gap-4 mb-2">
                    <h2 className="text-white text-2xl font-bold flex-1">
                        {submission.english_title}
                    </h2>
                    <p className="text-white/80 text-sm line-clamp-2">
                        {submission.english_synopsis}
                    </p>
                </div>

                <button
                    onClick={toggleMute}
                    className="absolute top-4 right-4 p-3 bg-black/50 rounded-full text-white z-10"
                >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>

                {!isPlaying && isActive && (
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                        onClick={togglePlay}
                    >
                        <div className="bg-black/50 rounded-full p-6">
                            <Play size={40} className="text-white" />
                        </div>
                    </div>
                )}
            </div>

            <div className="hidden md:flex md:flex-col md:items-center md:justify-start md:h-full md:w-full md:overflow-y-auto md:bg-black md:pt-20">
                <div className="w-full max-w-5xl mx-auto mt-8 px-4">
                    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                        <video
                            ref={videoRef}
                            src={video_url}
                            className="h-full w-full object-contain"
                            loop
                            muted={isMuted}
                            playsInline
                            onClick={togglePlay}
                        />

                        <button
                            onClick={toggleMute}
                            className="absolute top-6 right-6 p-3 bg-black/50 rounded-full text-white z-10"
                        >
                            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                        </button>

                        {!isPlaying && isActive && (
                            <div
                                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                onClick={togglePlay}
                            >
                                <div className="bg-black/50 rounded-full p-6">
                                    <Play size={48} className="text-white" />
                                </div>
                            </div>
                        )}
                    </div>

                    <VideoInfosDesktop 
                        submission={submission}
                        addToPlaylist={addToPlaylist}
                        rateSubmission={rateSubmission}
                        selection={selection}
                        toggle={toggle}
                        hasRating={hasRating}
                        markAsRated={markAsRated}
                    />
                </div>
            </div>
        </>
    );
};

export default VideoCard;