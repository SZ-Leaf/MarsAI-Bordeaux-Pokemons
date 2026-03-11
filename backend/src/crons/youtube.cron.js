import db from '../config/db_pool.js';
import { getYoutubeVideosToCheck, updateYoutubeStatus } from '../models/submissions/submissions.model.js';
import { checkYoutubeVideoStatus } from '../services/youtube.services.js';

export const startYoutubeCron = async () => {
  console.log('YouTube cron started');
  let isRunning = false;
  setInterval(async () => {
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
            await updateYoutubeStatus(connection, video.id, statusData.status, statusData.rejectionReason, statusData.failureReason);
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
  }, 30 * 1000);
};
