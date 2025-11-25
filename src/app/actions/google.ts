'use server';

import { createCalendarEvent, saveToDrive } from '@/lib/google';

export async function createCalendarEventAction(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;
    const startTimeStr = formData.get('startTime') as string;
    const endTimeStr = formData.get('endTime') as string;

    if (!title || !date || !startTimeStr || !endTimeStr) {
        return { success: false, message: '필수 항목이 누락되었습니다.' };
    }

    // Combine date and time
    const startDateTime = new Date(`${date}T${startTimeStr}:00`);
    const endDateTime = new Date(`${date}T${endTimeStr}:00`);

    try {
        const link = await createCalendarEvent({
            summary: title,
            description: description,
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
        });
        return { success: true, link };
    } catch (error) {
        console.error('Calendar Event Creation Failed:', error);
        return { success: false, message: '일정 생성에 실패했습니다.' };
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
