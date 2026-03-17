import cron from 'node-cron';
import { getYoutubeVideosToCheck, updateYoutubeStatus } from '../models/submissions/submissions.model.js';
import { checkYoutubeVideoStatus } from '../services/youtube.services.js';

export const startYoutubeCron = () => {
  console.log('YouTube cron started');

  let isRunning = false;

  cron.schedule('*/30 * * * * *', async () => {
    if (isRunning) return;
    isRunning = true;
    try {
      const videos = await getYoutubeVideosToCheck();

      if (!videos.length) {
        console.log('No YouTube videos to check');
      } else {
        console.log(`Found ${videos.length} video(s) to check`);
      }
      for (const video of videos) {
        try {
          const statusData = await checkYoutubeVideoStatus(video.youtube_id);

          if (statusData) {
            await updateYoutubeStatus(
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
      isRunning = false;
    }
  });
};
