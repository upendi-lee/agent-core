import { NextRequest, NextResponse } from 'next/server';
import { saveCategoryFile, Category } from '@/lib/google';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { category, content, title } = body;

        if (!category || !content) {
            return NextResponse.json(
                { error: 'Category and content are required' },
                { status: 400 }
            );
        }

        // Validate category - all 9 categories
        const validCategories: Category[] = [
            'SCHEDULE', 'TASKS', 'NOTES', 'MEETINGS',
            'BRIEFING', 'HEALTH', 'MAIL', 'WEATHER', 'PROJECT'
        ];

        if (!validCategories.includes(category)) {
            return NextResponse.json(
                { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
                { status: 400 }
            );
        }

        // Save file to Google Drive
        const result = await saveCategoryFile(category as Category, content, title);

        return NextResponse.json({
            success: true,
            ...result,
        });

    } catch (error: any) {
        console.error('Error saving file to Google Drive:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to save file' },
            { status: 500 }
        );
    }
}
