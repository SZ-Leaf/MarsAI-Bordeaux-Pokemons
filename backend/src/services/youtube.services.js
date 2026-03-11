import fs from 'fs';
import { google } from 'googleapis';
import oauth2Client from '../config/oauth.js';
import 'dotenv/config';

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

const refreshAccessToken = async () => {
  const { token } = await oauth2Client.getAccessToken();
  oauth2Client.setCredentials({ access_token: token });
};

export const uploadVideo = async ({ title, description, tags = [], filePath }) => {
  await refreshAccessToken();
  const safeTags = Array.isArray(tags) ? tags.map(tag => String(tag)).filter(tag => tag.length > 0) : [];
  const response = await youtube.videos.insert({
    part: ['snippet','status'],
    requestBody: {
      snippet: { title, description, tags: safeTags },
      status: { privacyStatus: 'private' }
    },
    media: { body: fs.createReadStream(filePath) }
  });
  return response.data;
};

export const uploadThumbnail = async ({ videoId, thumbnailPath }) => {
  await refreshAccessToken();
  const response = await youtube.thumbnails.set({ videoId, media: { body: fs.createReadStream(thumbnailPath) } });
  return response.data;
};

export const uploadOrUpdateCaptions = async ({ videoId, srtPath }) => {
  await refreshAccessToken();
  const { data } = await youtube.captions.list({ part: ['id', 'snippet'], videoId });
  for (const track of (data.items || []).filter(t => t.snippet.language === 'fr')) {
    await youtube.captions.delete({ id: track.id });
  }
  const response = await youtube.captions.insert({
    part: ['snippet'],
    requestBody: { snippet: { videoId, language: 'fr', name: 'Français', isDraft: false } },
    media: { mimeType: 'application/octet-stream', body: fs.createReadStream(srtPath) }
  });
  return response.data;
};

export const deleteVideo = async (videoId) => {
  await refreshAccessToken();
  const response = await youtube.videos.delete({ id: videoId });
  return response.data;
};

export const updateYoutubeVideo = async ({ videoId, title, description, tags = [], privacyStatus = 'private', categoryId = 28 }) => {
  await refreshAccessToken();
  const safeTags = Array.isArray(tags) ? tags.map(tag => String(tag)).filter(tag => tag.length > 0) : [];
  const response = await youtube.videos.update({
    part: ['snippet', 'status'],
    requestBody: { id: videoId, snippet: { title, description, tags: safeTags, categoryId }, status: { privacyStatus } }
  });
  return response.data;
};

export const checkYoutubeVideoStatus = async (videoId) => {
  await refreshAccessToken();
  const response = await youtube.videos.list({ part: ['status','processingDetails','contentDetails','snippet'], id: [videoId] });
  if (!response.data.items.length) return null;
  const video = response.data.items[0];
  let status = video.status.uploadStatus;
  let rejectionReason = video.status.rejectionReason || null;
  let failureReason = video.processingDetails?.processingFailureReason || null;
  if (video.contentDetails?.regionRestriction) {
    status = 'blocked';
    rejectionReason = `region_restricted: ${JSON.stringify(video.contentDetails.regionRestriction)}`;
  }
  if (status === 'rejected' && !rejectionReason) {
    if (video.contentDetails?.contentRating) rejectionReason = `content_rating: ${JSON.stringify(video.contentDetails.contentRating)}`;
    else if (video.status?.privacyStatus === 'private') rejectionReason = 'private_or_restricted';
    else if (video.status?.license) rejectionReason = `license: ${video.status.license}`;
    else if (video.status?.embeddable === false) rejectionReason = 'not_embeddable';
    else rejectionReason = 'copyright_or_other_restriction';
  }
  const title = video.snippet?.title || null;
  const categoryId = video.snippet?.categoryId || null;
  return { status, rejectionReason, failureReason, title, categoryId };
};
