import { saveToDrive, createCalendarEvent } from '../lib/google';

async function testGoogleIntegration() {
    console.log('Starting Google Integration Test...');

    try {
        // Test Drive Integration
        console.log('Testing Google Drive Integration...');
        const content = 'This is a test file created by the Agent Core verification script.';
        const filename = `TestFile_${Date.now()}`;
        const fileId = await saveToDrive(content, filename);
        console.log(`Successfully created file in Drive. File ID: ${fileId}`);
    } catch (error) {
        console.error('Google Drive Integration Failed:', error);
    }

    try {
        // Test Calendar Integration
        console.log('Testing Google Calendar Integration...');
        const now = new Date();
        const startTime = new Date(now.getTime() + 60 * 60 * 1000).toISOString(); // 1 hour from now
        const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours from now

        const eventLink = await createCalendarEvent({
            summary: 'Agent Core Verification Event',
            description: 'This event was created to verify the Agent Core Google Calendar integration.',
            startTime: startTime,
            endTime: endTime,
        });
        console.log(`Successfully created event in Calendar. Event Link: ${eventLink}`);
    } catch (error) {
        console.error('Google Calendar Integration Failed:', error);
    }

    console.log('Google Integration Test Completed.');
}

testGoogleIntegration();
