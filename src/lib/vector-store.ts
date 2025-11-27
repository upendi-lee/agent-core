import { getDb } from './firebase';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import fs from 'fs';
import path from 'path';

// Define the embedding model (using Google's text-embedding-004 via Genkit)
// We'll use the embed method directly from the AI instance if available, or define a flow.

export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        // Using the embed method from Genkit's AI instance
        // Note: The model name might vary based on the plugin configuration.
        // 'text-embedding-004' is a common model for Gemini.
        const result = await ai.embed({
            embedder: 'text-embedding-004',
            content: text,
        });
        return result[0].embedding;
    } catch (error) {
        console.error('Error generating embedding:', error);
        // Fallback or rethrow depending on requirements. 
        // For now, we'll return an empty array or throw to indicate failure.
        return [];
    }
}

// Local Fallback Helpers
const DATA_DIR = path.join(process.cwd(), 'data');
const RECENT_ACTIVITY_FILE = path.join(DATA_DIR, 'recent-activity.json');

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

async function saveToLocalFile(collectionName: string, data: any) {
    ensureDataDir();
    let activities: any[] = [];
    if (fs.existsSync(RECENT_ACTIVITY_FILE)) {
        try {
            const fileContent = fs.readFileSync(RECENT_ACTIVITY_FILE, 'utf-8');
            activities = JSON.parse(fileContent);
        } catch (e) {
            console.error('Error reading local activity file:', e);
            activities = [];
        }
    }

    const newDoc = {
        id: `local_${Date.now()}`,
        collection: collectionName,
        ...data,
        createdAt: new Date().toISOString(),
    };

    // Deduplication: Check if the latest entry is identical and created recently (within 5 seconds)
    if (activities.length > 0) {
        const latest = activities[0];
        const isSameContent = JSON.stringify(latest.data) === JSON.stringify(data) ||
            (latest.title === data.title && latest.content === data.content && latest.description === data.description);

        const timeDiff = Date.now() - new Date(latest.createdAt).getTime();

        if (isSameContent && timeDiff < 5000) {
            console.log('Duplicate save detected (local fallback), skipping.');
            return { success: true, id: latest.id };
        }
    }

    activities.unshift(newDoc); // Add to beginning
    // Keep only last 50 items
    if (activities.length > 50) {
        activities = activities.slice(0, 50);
    }

    fs.writeFileSync(RECENT_ACTIVITY_FILE, JSON.stringify(activities, null, 2));
    return { success: true, id: newDoc.id };
}

async function getFromLocalFile(limitCount: number) {
    if (!fs.existsSync(RECENT_ACTIVITY_FILE)) {
        return [];
    }
    try {
        const fileContent = fs.readFileSync(RECENT_ACTIVITY_FILE, 'utf-8');
        const activities = JSON.parse(fileContent);
        return activities.slice(0, limitCount);
    } catch (e) {
        console.error('Error reading local activity file:', e);
        return [];
    }
}

export async function saveToVectorStore(collectionName: string, data: any) {
    // Try Firestore first
    try {
        const db = getDb(); // This throws if init fails

        // 1. Generate embedding for the content
        const textToEmbed = data.content || data.description || data.title || '';
        let embedding: number[] = [];
        if (textToEmbed) {
            embedding = await generateEmbedding(textToEmbed);
        }

        // 2. Prepare data with embedding
        const docData = {
            ...data,
            embedding: embedding, // Store embedding vector
            createdAt: new Date().toISOString(),
        };

        // 3. Save to Firestore
        const docRef = await db.collection(collectionName).add(docData);
        console.log(`Document saved to ${collectionName} with ID: ${docRef.id}`);

        return { success: true, id: docRef.id };
    } catch (error) {
        console.warn(`Firestore unavailable, falling back to local file. Error: ${error}`);
        // Fallback to local file
        return await saveToLocalFile(collectionName, data);
    }
}

export async function getRecentDocuments(limitCount: number = 5) {
    try {
        const db = getDb(); // This throws if init fails
        const collections = ['notes', 'tasks', 'schedules', 'meetings'];
        let allDocs: any[] = [];

        for (const colName of collections) {
            const snapshot = await db.collection(colName)
                .orderBy('createdAt', 'desc')
                .limit(limitCount)
                .get();

            snapshot.forEach((doc: any) => {
                allDocs.push({
                    id: doc.id,
                    collection: colName,
                    ...doc.data(),
                });
            });
        }

        // Sort combined results by createdAt desc
        allDocs.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
        });

        return allDocs.slice(0, limitCount);
    } catch (error) {
        console.warn(`Firestore unavailable, falling back to local file. Error: ${error}`);
        return await getFromLocalFile(limitCount);
    }
}
