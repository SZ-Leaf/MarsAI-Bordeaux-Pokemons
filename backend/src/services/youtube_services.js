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

export const uploadVideo = async ({ title, description, filePath }) => {
  return youtube.videos.insert({
    part: 'snippet,status',
    requestBody: {
      snippet: { title, description },
      status: { privacyStatus: 'private' }
    },
    media: { body: fs.createReadStream(filePath) },
  });
};
