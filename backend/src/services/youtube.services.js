import fs from 'fs';
import { google } from 'googleapis';
import oauth2Client from '../config/oauth.js';
import 'dotenv/config';

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

export const uploadVideo = async ({ title, description, tags = [], filePath }) => {
  const { token } = await oauth2Client.getAccessToken();
  oauth2Client.setCredentials({ access_token: token });
  const response = await youtube.videos.insert({
    part: 'snippet,status',
    requestBody: { snippet: { title, description, tags }, status: { privacyStatus: 'private' } },
    media: { body: fs.createReadStream(filePath) },
  });
  return response.data;
};

export const uploadThumbnail = async ({ videoId, thumbnailPath }) => {
  const response = await youtube.thumbnails.set({ videoId, media: { body: fs.createReadStream(thumbnailPath) } });
  return response.data;
};

export const uploadOrUpdateCaptions = async ({ videoId, srtPath }) => {
  const { data } = await youtube.captions.list({ part: ['id','snippet'], videoId });

  for (const track of data.items.filter(t => t.snippet.language === language)) {
    await youtube.captions.delete({ id: track.id });
  }
  return youtube.captions.insert({
    part: 'snippet',
    requestBody: {
      snippet: {
        videoId,
        language: "fr",
        name: "Francais",
        isDraft: false
      }
    },
    media: { mimeType: 'text/srt', body: fs.createReadStream(srtPath) }
  });
};

export const deleteVideo = async (videoId) => {
  const { token } = await oauth2Client.getAccessToken();
  oauth2Client.setCredentials({ access_token: token });
  const response = await youtube.videos.delete({ id: videoId });
  return response.data;
};

export const updateYoutubeVideo = async ({ videoId, title, description, tags = [], privacyStatus = 'private', categoryId = 28 }) => {
  const { token } = await oauth2Client.getAccessToken();
  oauth2Client.setCredentials({ access_token: token });
  const response = await youtube.videos.update({
    part: 'snippet,status',
    requestBody: { id: videoId, snippet: { title, description, tags, categoryId }, status: { privacyStatus } },
  });
  return response.data;
};
