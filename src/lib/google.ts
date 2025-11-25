import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment variables for Google OAuth
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/google';

// Scopes for Drive and Calendar
const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/calendar',
];

/**
 * Retrieves the Google OAuth2 client.
 * @returns {OAuth2Client} The authenticated OAuth2 client.
 */
export const getGoogleAuthClient = (): OAuth2Client => {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Missing Google OAuth credentials in environment variables.');
  }

  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  // TODO: Implement token retrieval logic.
  // For now, we assume the user has a way to provide the refresh token or access token.
  // In a real application, you would handle the OAuth flow to get these tokens.
  // For this specific task, we might need to ask the user for a refresh token if we want persistent access,
  // or we can use a service account if appropriate (but the request implies user context).

  // IMPORTANT: Since we don't have a full OAuth flow implemented in the frontend yet,
  // we will rely on environment variables for tokens if available, or throw an error.
  // You might need to manually generate a refresh token for testing.

  const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
  if (REFRESH_TOKEN) {
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  }

  return oAuth2Client;
};

/**
 * Saves content to a specific Google Drive folder.
 * @param {string} content The content to save.
 * @param {string} filename The name of the file.
 * @param {string} folderName The name of the folder to save to (default: "AGENT-CORE").
 * @returns {Promise<string>} The ID of the created file.
 */
export const saveToDrive = async (content: string, filename: string, folderName: string = 'AGENT-CORE'): Promise<string> => {
  const auth = getGoogleAuthClient();
  const drive = google.drive({ version: 'v3', auth });

  // 1. Check if the folder exists
  let folderId: string | null | undefined;
  const folderRes = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`,
    fields: 'files(id, name)',
  });

  if (folderRes.data.files && folderRes.data.files.length > 0) {
    folderId = folderRes.data.files[0].id;
  } else {
    // 2. Create the folder if it doesn't exist
    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };
    const folder = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id',
    });
    folderId = folder.data.id;
  }

  if (!folderId) {
    throw new Error("Failed to find or create folder.");
  }

  // 3. Create the file inside the folder
  const fileMetadata = {
    name: filename,
    parents: [folderId],
  };
  const media = {
    mimeType: 'text/plain',
    body: content,
  };

  const file = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id',
  });

  return file.data.id || '';
};

/**
 * Creates an event in Google Calendar.
 * @param {object} eventDetails The details of the event.
 * @returns {Promise<string>} The link to the created event.
 */
export const createCalendarEvent = async (eventDetails: {
  summary: string;
  description?: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
}): Promise<string> => {
  const auth = getGoogleAuthClient();
  const calendar = google.calendar({ version: 'v3', auth });

  const event = {
    summary: eventDetails.summary,
    description: eventDetails.description,
    start: {
      dateTime: eventDetails.startTime,
      timeZone: 'Asia/Seoul', // Default to Seoul, can be parameterized
    },
    end: {
      dateTime: eventDetails.endTime,
      timeZone: 'Asia/Seoul',
    },
  };

  const res = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  });

  return res.data.htmlLink || '';
};

/**
 * Category types for organizing files
 */
export type Category = 'SCHEDULE' | 'TASKS' | 'NOTES' | 'MEETINGS' | 'BRIEFING' | 'HEALTH' | 'MAIL' | 'WEATHER' | 'PROJECT';

/**
 * Gets the folder path for a specific category
 * @param {Category} category The category name
 * @returns {string[]} Array of folder names representing the path
 */
export const getCategoryFolderPath = (category: Category): string[] => {
  return ['AGENT-CORE', category];
};

/**
 * Generates a filename based on title and category
 * If no title is provided, uses current date and time
 * @param {string} title Optional title for the file
 * @param {Category} category Optional category for prefix
 * @returns {string} Generated filename
 */
export const generateFilename = (title?: string, category?: Category): string => {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, ''); // HHMMSS

  if (title) {
    // Sanitize title for filename
    const sanitized = title.replace(/[^a-zA-Z0-9가-힣\s]/g, '').replace(/\s+/g, '_');
    return `${sanitized}_${dateStr}_${timeStr}.txt`;
  }

  const prefix = category ? `${category.toLowerCase()}_` : '';
  return `${prefix}${dateStr}_${timeStr}.txt`;
};

/**
 * Creates a nested folder structure in Google Drive
 * @param {string[]} folderPath Array of folder names (e.g., ['AGENT-CORE', 'NOTES'])
 * @returns {Promise<string>} The ID of the final folder
 */
export const createNestedFolder = async (folderPath: string[]): Promise<string> => {
  const auth = getGoogleAuthClient();
  const drive = google.drive({ version: 'v3', auth });

  let parentId: string | undefined = undefined;

  for (const folderName of folderPath) {
    // Check if folder exists
    const query: string = parentId
      ? `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and '${parentId}' in parents and trashed=false`
      : `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`;

    const searchRes = await drive.files.list({
      q: query,
      fields: 'files(id, name)',
    });

    if (searchRes.data.files && searchRes.data.files.length > 0) {
      // Folder exists
      parentId = searchRes.data.files[0].id!;
    } else {
      // Create folder
      const fileMetadata: any = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      };

      if (parentId) {
        fileMetadata.parents = [parentId];
      }

      const folder = await drive.files.create({
        requestBody: fileMetadata,
        fields: 'id',
      });

      parentId = folder.data.id!;
    }
  }

  if (!parentId) {
    throw new Error('Failed to create folder structure');
  }

  return parentId;
};

/**
 * Saves content to a category-specific folder in Google Drive
 * @param {Category} category The category for organizing the file
 * @param {string} content The content to save
 * @param {string} title Optional title for the file
 * @returns {Promise<{fileId: string, fileName: string, webViewLink: string}>} File information
 */
export const saveCategoryFile = async (
  category: Category,
  content: string,
  title?: string
): Promise<{ fileId: string; fileName: string; webViewLink: string }> => {
  const auth = getGoogleAuthClient();
  const drive = google.drive({ version: 'v3', auth });

  // 1. Create nested folder structure
  const folderPath = getCategoryFolderPath(category);
  const folderId = await createNestedFolder(folderPath);

  // 2. Generate filename
  const fileName = generateFilename(title, category);

  // 3. Create file
  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };

  const media = {
    mimeType: 'text/plain',
    body: content,
  };

  const file = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id, name, webViewLink',
  });

  return {
    fileId: file.data.id || '',
    fileName: file.data.name || fileName,
    webViewLink: file.data.webViewLink || '',
  };
};

/**
 * Creates a task in Google Calendar
 * @param {object} taskDetails The details of the task
 * @returns {Promise<string>} The link to the created task
 */
export const createCalendarTask = async (taskDetails: {
  summary: string;
  description?: string;
  dueDate?: string; // ISO string
}): Promise<string> => {
  const auth = getGoogleAuthClient();
  const calendar = google.calendar({ version: 'v3', auth });

  // For tasks, we create an all-day event with a specific category
  const event = {
    summary: `📋 ${taskDetails.summary}`,
    description: taskDetails.description,
    start: {
      date: taskDetails.dueDate ? taskDetails.dueDate.split('T')[0] : new Date().toISOString().split('T')[0],
    },
    end: {
      date: taskDetails.dueDate ? taskDetails.dueDate.split('T')[0] : new Date().toISOString().split('T')[0],
    },
    colorId: '11', // Red color for tasks
  };

  const res = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  });

  return res.data.htmlLink || '';
};
