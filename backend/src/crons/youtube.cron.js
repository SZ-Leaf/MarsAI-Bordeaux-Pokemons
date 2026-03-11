import db from '../config/db_pool.js';
import { getYoutubeVideosToCheck, updateYoutubeStatus } from '../models/submissions/submissions.model.js';
import { checkYoutubeVideoStatus } from '../services/youtube.services.js';

export const startYoutubeCron = () => {
  console.log('YouTube cron scheduled');
  let isRunning = false;

  const run = async () => {
    if (isRunning) return;
    isRunning = true;

    const connection = await db.pool.getConnection();
    try {
      const videos = await getYoutubeVideosToCheck(connection);

      if (!videos.length) console.log('No YouTube videos to check');
      else console.log(`Found ${videos.length} video(s) to check`);

      for (const video of videos) {
        try {
          const statusData = await checkYoutubeVideoStatus(video.youtube_id);
          if (statusData) {
            await updateYoutubeStatus(
              connection,
              video.id,
              statusData.status,
              statusData.rejectionReason,
              statusData.failureReason
            );
            console.log(`Updated YouTube status for submission ${video.id}: ${statusData.status}`);
          }
        } catch (videoErr) {
          console.error(`Error checking video ${video.youtube_id}:`, videoErr.message);
        }
      }
    } catch (err) {
      console.error('YouTube cron error:', err.message);
    } finally {
      connection.release();
      isRunning = false;
    }
  };

  const now = new Date();
  const nextRun = new Date();
  nextRun.setHours(6, 0, 0, 0);

  if (now >= nextRun) nextRun.setDate(nextRun.getDate() + 1);

  const delay = nextRun - now;

  setTimeout(() => {
    run();
    setInterval(run, 24 * 60 * 60 * 1000);
  }, delay);
};
