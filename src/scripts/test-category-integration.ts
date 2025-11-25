import * as dotenv from 'dotenv';
import { saveCategoryFile, createCalendarEvent, createCalendarTask, Category } from '../lib/google';

// Load environment variables
dotenv.config();

async function testGoogleIntegration() {
    console.log('\n🧪 Google Drive & Calendar 통합 테스트\n');
    console.log('='.repeat(60));

    const testResults: { name: string; status: string; details?: string }[] = [];

    // Test 1: Save to NOTES category
    console.log('\n📝 테스트 1: NOTES 카테고리에 파일 저장');
    try {
        const result = await saveCategoryFile(
            'NOTES',
            '이것은 테스트 노트입니다.\n\n작성 시간: ' + new Date().toLocaleString('ko-KR'),
            '테스트 노트'
        );
        console.log('✅ 성공!');
        console.log(`   파일명: ${result.fileName}`);
        console.log(`   링크: ${result.webViewLink}`);
        testResults.push({ name: 'NOTES 저장', status: '✅', details: result.fileName });
    } catch (error: any) {
        console.error('❌ 실패:', error.message);
        testResults.push({ name: 'NOTES 저장', status: '❌', details: error.message });
    }

    // Test 2: Save to MEETINGS category
    console.log('\n👥 테스트 2: MEETINGS 카테고리에 파일 저장');
    try {
        const result = await saveCategoryFile(
            'MEETINGS',
            '회의 요약\n\n참석자: 김철수, 이영희\n주제: 프로젝트 진행 상황\n\n작성 시간: ' + new Date().toLocaleString('ko-KR')
        );
        console.log('✅ 성공!');
        console.log(`   파일명: ${result.fileName}`);
        console.log(`   링크: ${result.webViewLink}`);
        testResults.push({ name: 'MEETINGS 저장', status: '✅', details: result.fileName });
    } catch (error: any) {
        console.error('❌ 실패:', error.message);
        testResults.push({ name: 'MEETINGS 저장', status: '❌', details: error.message });
    }

    // Test 3: Save to HEALTH category
    console.log('\n💪 테스트 3: HEALTH 카테고리에 파일 저장');
    try {
        const result = await saveCategoryFile(
            'HEALTH',
            '건강 기록\n\n걸음 수: 8,500\n수면 시간: 7시간\n칼로리: 2,100 kcal\n\n기록 시간: ' + new Date().toLocaleString('ko-KR'),
            '일일 건강 기록'
        );
        console.log('✅ 성공!');
        console.log(`   파일명: ${result.fileName}`);
        console.log(`   링크: ${result.webViewLink}`);
        testResults.push({ name: 'HEALTH 저장', status: '✅', details: result.fileName });
    } catch (error: any) {
        console.error('❌ 실패:', error.message);
        testResults.push({ name: 'HEALTH 저장', status: '❌', details: error.message });
    }

    // Test 4: Create Calendar Event
    console.log('\n📅 테스트 4: Google Calendar 이벤트 생성');
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(14, 0, 0, 0);

        const endTime = new Date(tomorrow);
        endTime.setHours(15, 0, 0, 0);

        const link = await createCalendarEvent({
            summary: '테스트 회의',
            description: '이것은 자동 생성된 테스트 이벤트입니다.',
            startTime: tomorrow.toISOString(),
            endTime: endTime.toISOString(),
        });
        console.log('✅ 성공!');
        console.log(`   링크: ${link}`);
        testResults.push({ name: 'Calendar 이벤트', status: '✅', details: '내일 14:00' });
    } catch (error: any) {
        console.error('❌ 실패:', error.message);
        testResults.push({ name: 'Calendar 이벤트', status: '❌', details: error.message });
    }

    // Test 5: Create Calendar Task
    console.log('\n✅ 테스트 5: Google Calendar 할일 생성');
    try {
        const today = new Date().toISOString();
        const link = await createCalendarTask({
            summary: '테스트 할일',
            description: '이것은 자동 생성된 테스트 할일입니다.',
            dueDate: today,
        });
        console.log('✅ 성공!');
        console.log(`   링크: ${link}`);
        testResults.push({ name: 'Calendar 할일', status: '✅', details: '오늘' });
    } catch (error: any) {
        console.error('❌ 실패:', error.message);
        testResults.push({ name: 'Calendar 할일', status: '❌', details: error.message });
    }

    // Test 6: Save to all categories
    console.log('\n📂 테스트 6: 모든 카테고리에 파일 저장');
    const categories: Category[] = ['BRIEFING', 'MAIL', 'WEATHER', 'PROJECT'];

    for (const category of categories) {
        try {
            const result = await saveCategoryFile(
                category,
                `${category} 테스트 파일\n\n생성 시간: ${new Date().toLocaleString('ko-KR')}`
            );
            console.log(`✅ ${category}: ${result.fileName}`);
            testResults.push({ name: `${category} 저장`, status: '✅', details: result.fileName });
        } catch (error: any) {
            console.error(`❌ ${category}: ${error.message}`);
            testResults.push({ name: `${category} 저장`, status: '❌', details: error.message });
        }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 테스트 결과 요약\n');

    const passed = testResults.filter(r => r.status === '✅').length;
    const failed = testResults.filter(r => r.status === '❌').length;

    testResults.forEach(result => {
        console.log(`${result.status} ${result.name}`);
        if (result.details) {
            console.log(`   ${result.details}`);
        }
    });

    console.log('\n' + '='.repeat(60));
    console.log(`\n✅ 통과: ${passed}개`);
    console.log(`❌ 실패: ${failed}개`);
    console.log(`📊 성공률: ${Math.round((passed / testResults.length) * 100)}%\n`);

    if (failed === 0) {
        console.log('🎉 모든 테스트를 통과했습니다!');
        console.log('\n📌 Google Drive에서 확인하세요:');
        console.log('   https://drive.google.com/drive/my-drive');
        console.log('\n📌 Google Calendar에서 확인하세요:');
        console.log('   https://calendar.google.com\n');
    }
}

testGoogleIntegration().catch(console.error);
