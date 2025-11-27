import { saveToVectorStore, getRecentDocuments } from '../lib/vector-store';

async function testPersistence() {
    console.log('Testing Local Persistence...');

    // 1. Save a test document
    const testData = {
        title: 'Persistence Test',
        content: 'This is a test note to verify local file saving.',
        tags: ['test', 'persistence'],
        source: 'test-script'
    };

    console.log('Saving document...');
    const saveResult = await saveToVectorStore('notes', testData);
    console.log('Save Result:', saveResult);

    if (!saveResult.success && !saveResult.id) {
        console.error('Save failed!');
        return;
    }

    // 2. Retrieve recent documents
    console.log('Retrieving documents...');
    const docs = await getRecentDocuments(5);
    console.log('Retrieved Docs:', docs);

    // 3. Verify
    const found = docs.find((d: any) => d.title === 'Persistence Test');
    if (found) {
        console.log('SUCCESS: Test document found in recent documents.');
    } else {
        console.error('FAILURE: Test document NOT found.');
    }
}

testPersistence().catch(console.error);
