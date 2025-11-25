import { NextRequest, NextResponse } from 'next/server';
import { createCalendarEvent, createCalendarTask } from '@/lib/google';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, summary, description, startTime, endTime, dueDate } = body;

        if (!type || !summary) {
            return NextResponse.json(
                { error: 'Type and summary are required' },
                { status: 400 }
            );
        }

        let link: string;

        if (type === 'event') {
            // Create calendar event
            if (!startTime || !endTime) {
                return NextResponse.json(
                    { error: 'Start time and end time are required for events' },
                    { status: 400 }
                );
            }

            link = await createCalendarEvent({
                summary,
                description,
                startTime,
                endTime,
            });

        } else if (type === 'task') {
            // Create calendar task
            link = await createCalendarTask({
                summary,
                description,
                dueDate,
            });

        } else {
            return NextResponse.json(
                { error: 'Invalid type. Must be "event" or "task"' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            link,
            type,
        });

    } catch (error: any) {
        console.error('Error creating calendar item:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create calendar item' },
            { status: 500 }
        );
    }
}
