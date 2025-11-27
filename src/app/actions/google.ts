'use server';

import { createCalendarEvent, saveToDrive } from '@/lib/google';

export async function createCalendarEventAction(formData: FormData) {
    const title = formData.get('title') as string;
    let description = formData.get('description') as string;
    const date = formData.get('date') as string;
    const startTimeStr = formData.get('startTime') as string;
    const endTimeStr = formData.get('endTime') as string;

    if (!title || !date || !startTimeStr || !endTimeStr) {
        return { success: false, message: '필수 항목이 누락되었습니다.' };
    }

    // If description is empty, use title
    if (!description) {
        description = title;
    }

    // Combine date and time
    const cleanDate = date.trim();
    const cleanStartTime = startTimeStr.trim();
    const cleanEndTime = endTimeStr.trim();

    console.log(`[DEBUG] Inputs - Date: '${cleanDate}', Start: '${cleanStartTime}', End: '${cleanEndTime}'`);

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(cleanDate)) {
        console.error(`Invalid Date Format: ${cleanDate}`);
        return { success: false, message: `날짜 형식이 올바르지 않습니다 (YYYY-MM-DD): ${cleanDate}` };
    }

    const startDateTime = new Date(`${cleanDate}T${cleanStartTime}:00`);
    const endDateTime = new Date(`${cleanDate}T${cleanEndTime}:00`);

    console.log(`[DEBUG] ISO Strings - Start: ${startDateTime.toISOString()}, End: ${endDateTime.toISOString()}`);

    if (isNaN(startDateTime.getTime())) {
        console.error(`Invalid Start Time: ${cleanDate}T${cleanStartTime}:00`);
        return { success: false, message: `시작 시간이 올바르지 않습니다: ${cleanDate} ${cleanStartTime}` };
    }
    if (isNaN(endDateTime.getTime())) {
        console.error(`Invalid End Time: ${cleanDate}T${cleanEndTime}:00`);
        return { success: false, message: `종료 시간이 올바르지 않습니다: ${cleanDate} ${cleanEndTime}` };
    }

    if (startDateTime >= endDateTime) {
        return { success: false, message: '종료 시간은 시작 시간보다 늦어야 합니다.' };
    }

    try {
        const link = await createCalendarEvent({
            summary: title,
            description: description,
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
        });

        // 2. Save to Vector Store (New)
        try {
            const { saveToVectorStore } = await import('@/lib/vector-store');
            await saveToVectorStore('schedules', {
                title,
                description,
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString(),
                calendarLink: link,
                source: 'schedule-manager'
            });
        } catch (vecError) {
            console.error('Vector Store Save Failed (Non-fatal):', vecError);
        }

        return { success: true, link };
    } catch (error) {
        console.error('Calendar Event Creation Failed:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, message: `일정 생성 실패: ${errorMessage}` };
    }
}

export async function saveToDriveAction(content: string, filename: string) {
    try {
        const fileId = await saveToDrive(content, filename);
        return { success: true, fileId };
    } catch (error) {
        console.error('Drive Save Failed:', error);
        return { success: false, message: '파일 저장에 실패했습니다.' };
    }
}

export async function saveNoteAction(content: string, tags: string[]) {
    try {
        const { saveCategoryFile } = await import('@/lib/google');
        // Save just the content as requested
        const formattedContent = content;
        // Use the first few words as title if possible, or let generateFilename handle it
        const title = content.slice(0, 20) + (content.length > 20 ? '...' : '');

        // 1. Save to Google Drive (Existing)
        const driveResult = await saveCategoryFile('NOTES', formattedContent, title);

        // 2. Save to Vector Store (New - Fire-and-forget or await depending on needs)
        // We'll await it to ensure it's saved, but catch errors so it doesn't fail the whole action if Firestore fails
        try {
            const { saveToVectorStore } = await import('@/lib/vector-store');
            await saveToVectorStore('notes', {
                content,
                tags,
                title,
                driveFileId: driveResult.fileId, // Link to Drive file
                source: 'quick-input'
            });
        } catch (vecError) {
            console.error('Vector Store Save Failed (Non-fatal):', vecError);
        }

        return { success: true, ...driveResult };
    } catch (error) {
        console.error('Note Save Failed:', error);
        return { success: false, message: '노트 저장에 실패했습니다.' };
    }
}

export async function createCalendarTaskAction(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;

    if (!title || !date) {
        return { success: false, message: '필수 항목이 누락되었습니다.' };
    }

    try {
        const { createCalendarTask } = await import('@/lib/google');
        const link = await createCalendarTask({
            summary: title,
            description: description,
            dueDate: date, // Tasks are all-day by default in this implementation
        });

        // 2. Save to Vector Store (New)
        try {
            const { saveToVectorStore } = await import('@/lib/vector-store');
            await saveToVectorStore('tasks', {
                title,
                description,
                date,
                calendarLink: link,
                source: 'quick-input'
            });
        } catch (vecError) {
            console.error('Vector Store Save Failed (Non-fatal):', vecError);
        }

        return { success: true, link };
    } catch (error) {
        console.error('Calendar Task Creation Failed:', error);
        return { success: false, message: '할 일 생성에 실패했습니다.' };
    }
}

export async function saveMeetingAction(summary: string, actionItems: string[]) {
    try {
        const { saveCategoryFile } = await import('@/lib/google');
        const content = `회의 요약:\n${summary}\n\n실행 항목:\n${actionItems.join('\n- ')}`;
        const title = `Meeting_${new Date().toISOString().replace(/[:.]/g, '-')}`;

        // 1. Save to Google Drive
        const driveResult = await saveCategoryFile('MEETINGS', content, title);

        // 2. Save to Vector Store
        try {
            const { saveToVectorStore } = await import('@/lib/vector-store');
            await saveToVectorStore('meetings', {
                title,
                summary,
                actionItems,
                driveFileId: driveResult.fileId,
                source: 'meeting-summarizer'
            });
        } catch (vecError) {
            console.error('Vector Store Save Failed (Non-fatal):', vecError);
        }

        return { success: true, ...driveResult };
    } catch (error) {
        console.error('Meeting Save Failed:', error);
        return { success: false, message: '회의록 저장에 실패했습니다.' };
    }
}

export async function getRecentActivityAction() {
    try {
        const { getRecentDocuments } = await import('@/lib/vector-store');
        const docs = await getRecentDocuments(5);
        return { success: true, data: docs };
    } catch (error) {
        console.error('Failed to get recent activity:', error);
        return { success: false, data: [] };
    }
}

export async function getCalendarEvents(startTime: string, endTime: string) {
    try {
        const { listCalendarEvents } = await import('@/lib/google');
        const events = await listCalendarEvents(startTime, endTime);
        return { success: true, data: events };
    } catch (error) {
        console.error('Failed to get calendar events:', error);
        return { success: false, message: '일정을 불러오는데 실패했습니다.' };
    }
}

export async function getDailyBriefingDataAction() {
    try {
        const { listCalendarEvents } = await import('@/lib/google');
        const { getRecentDocuments } = await import('@/lib/vector-store');

        // 1. Get Today's Schedule
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
        const events = await listCalendarEvents(startOfDay, endOfDay);

        // 2. Get Recent Tasks & Notes
        const recentDocs = await getRecentDocuments(10);
        const tasks = recentDocs.filter((doc: any) => doc.collection === 'tasks');
        const notes = recentDocs.filter((doc: any) => doc.collection === 'notes');

        return {
            success: true,
            data: {
                schedules: events,
                tasks: tasks,
                notes: notes
            }
        };
    } catch (error) {
        console.error('Failed to get briefing data:', error);
        return { success: false, message: '브리핑 데이터를 불러오는데 실패했습니다.' };
    }
}
