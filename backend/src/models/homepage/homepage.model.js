import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, '../../data/homepage.json');

export const getHomepageData = async () => {
  const raw = await readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
};

export const updateHomepageData = async (data) => {
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
  return data;
};
