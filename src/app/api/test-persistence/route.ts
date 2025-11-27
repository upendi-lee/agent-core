import { NextResponse } from 'next/server';
import { saveToVectorStore, getRecentDocuments } from '@/lib/vector-store';

export async function GET() {
    const results: any = {
        save: { status: 'pending', message: '' },
        retrieve: { status: 'pending', message: '' },
    };

    try {
        // 1. Save a test document
        const testData = {
            title: 'Persistence Test API',
            content: 'This is a test note to verify local file saving via API.',
            tags: ['test', 'persistence', 'api'],
            source: 'test-api'
        };

        const saveResult = await saveToVectorStore('notes', testData);
        results.save = saveResult;

        // 2. Retrieve recent documents
        const docs = await getRecentDocuments(5);
        const found = docs.find((d: any) => d.title === 'Persistence Test API');

        results.retrieve = {
            success: !!found,
            foundDoc: found || null,
            allDocsCount: docs.length
        };

    } catch (error: any) {
        results.error = error.message;
    }

    return NextResponse.json(results);
}
