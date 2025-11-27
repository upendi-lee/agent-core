import { NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import { getDb } from '@/lib/firebase';

export async function GET() {
    const results: any = {
        genkit: { status: 'pending', message: '', reloadCheck: 'v3' },
        firestore: { status: 'pending', message: '' },
        env: {
            GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'Set' : 'Missing',
            FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? 'Set' : 'Missing',
            FIREBASE_SERVICE_ACCOUNT_KEY: process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? 'Set' : 'Missing',
        }
    };

    // Test Genkit with multiple models
    results.genkit = {};

    // 1. Try to list models directly via HTTP to see what is available
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            const data = await response.json();
            results.genkit.availableModels = data;
        } else {
            results.genkit.availableModels = 'No API Key';
        }
    } catch (e: any) {
        results.genkit.availableModelsError = e.message;
    }

    // Test Firestore
    try {
        const db = getDb();
        const testDoc = {
            test: true,
            createdAt: new Date().toISOString(),
        };
        const docRef = await db.collection('test_connectivity').add(testDoc);
        results.firestore = { status: 'success', docId: docRef.id };
    } catch (error: any) {
        results.firestore = { status: 'error', message: error.message };
    }

    return NextResponse.json(results);
}
