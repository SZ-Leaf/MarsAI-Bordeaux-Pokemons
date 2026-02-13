import fs from 'fs';
import { google } from 'googleapis';
import oauth2Client from '../config/oauth.js';
import 'dotenv/config';

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client,
});

export const uploadVideo = async ({ title, description, tags = [], filePath }) => {
  try {
    const { token } = await oauth2Client.getAccessToken();
    oauth2Client.setCredentials({ access_token: token });

    const response = await youtube.videos.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title,
          description,
          tags
        },
        status: {
          privacyStatus: 'private',
        },
      },
      media: {
        body: fs.createReadStream(filePath),
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erreur détaillée Google API :', error.response?.data || error.message);
    throw error;
  }
};


export const uploadThumbnail = async ({ videoId, thumbnailPath }) => {
  const response = await youtube.thumbnails.set({
    videoId,
    media: {
      body: fs.createReadStream(thumbnailPath),
    },
  });

  return response.data;
};

export const uploadCaptions = async ({ videoId, srtPath, language = 'fr' }) => {
  const response = await youtube.captions.insert({
    part: 'snippet',
    requestBody: {
      snippet: {
        videoId,
        language,
        name: 'Français',
        isDraft: false,
      },
    },
    media: {
      mimeType: 'text/srt',
      body: fs.createReadStream(srtPath),
    },
  });

  return response.data;
};
export const deleteVideo = async (videoId) => {
  try {
    const { token } = await oauth2Client.getAccessToken();
    oauth2Client.setCredentials({ access_token: token });

    const response = await youtube.videos.delete({
      id: videoId
    });

    console.log(`Vidéo ${videoId} supprimée avec succès !`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de la vidéo :', error.response?.data || error.message);
    throw error;
  }
};

export const updateYoutubeVideo = async ({ videoId, title, description, tags = [], privacyStatus = 'private', categoryId}) => {
  try {
    const { token } = await oauth2Client.getAccessToken();
    oauth2Client.setCredentials({ access_token: token });

    const response = await youtube.videos.update({
      part: 'snippet,status',
      requestBody: {
        id: videoId,
        snippet: {
          title,
          description,
          tags,
          categoryId
        },
        status: {
          privacyStatus
        }
      }
    });

    return response.data;
  } catch (err) {
    console.error('Erreur mise à jour YouTube :', err.response?.data || err.message);
    throw err;
  }
};
