import fs from 'fs';
import { google } from 'googleapis';
import oauth2Client from '../config/oauth.js';
import 'dotenv/config';

// On initialise avec le refresh_token du .env
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client,
});

export const uploadVideo = async ({ title, description, filePath }) => {
  try {
    // FORCE le rafraîchissement du jeton d'accès avant l'upload
    const { token } = await oauth2Client.getAccessToken();
    oauth2Client.setCredentials({ access_token: token });

    const response = await youtube.videos.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: { title, description },
        status: { privacyStatus: 'private' }
      },
      media: { body: fs.createReadStream(filePath) },
    });

    return response.data; // Retourne data pour avoir l'ID
  } catch (error) {
    console.error("Erreur détaillée Google API :", error.response?.data || error.message);
    throw error;
  }
};
