import * as dotenv from 'dotenv';
import { saveCategoryFile, createCalendarEvent, createCalendarTask, Category } from '../lib/google';

// Load environment variables
dotenv.config();

async function testAll9Categories() {
  console.log('\n🧪 9개 카테고리 전체 테스트\n');
  console.log('='.repeat(60));

  const testResults: { name: string; status: string; details?: string }[] = [];

  // Test 1: SCHEDULE - Calendar Event
  console.log('\n📅 테스트 1: SCHEDULE (Calendar 이벤트)');
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    
    const endTime = new Date(tomorrow);
    endTime.setHours(11, 0, 0, 0);

    const link = await createCalendarEvent({
      summary: '팀 미팅',
      description: 'SCHEDULE 카테고리 테스트',
      startTime: tomorrow.toISOString(),
      endTime: endTime.toISOString(),
    });
    console.log('✅ 성공!');
    console.log(`   링크: ${link}`);
    testResults.push({ name: 'SCHEDULE (Calendar)', status: '✅', details: '내일 10:00' });
  } catch (error: any) {
    console.error('❌ 실패:', error.message);
    testResults.push({ name: 'SCHEDULE (Calendar)', status: '❌', details: error.message });
  }

  // Test 2: TASKS - Calendar Task
  console.log('\n✅ 테스트 2: TASKS (Calendar 할일)');
  try {
    const today = new Date().toISOString();
    const link = await createCalendarTask({
      summary: '프로젝트 마감',
      description: 'TASKS 카테고리 테스트',
      dueDate: today,
    });
    console.log('✅ 성공!');
    console.log(`   링크: ${link}`);
    testResults.push({ name: 'TASKS (Calendar)', status: '✅', details: '오늘' });
  } catch (error: any) {
    console.error('❌ 실패:', error.message);
    testResults.push({ name: 'TASKS (Calendar)', status: '❌', details: error.message });
  }

  // Test 3-9: Drive Categories
  const driveCategories: { category: Category; emoji: string; title: string; content: string }[] = [
    {
      category: 'NOTES',
      emoji: '📝',
      title: '회의 노트',
      content: '오늘 회의 내용\n- 프로젝트 진행 상황 논의\n- 다음 스프린트 계획\n\n작성 시간: ' + new Date().toLocaleString('ko-KR')
    },
    {
      category: 'MEETINGS',
      emoji: '👥',
      title: '주간 회의',
      content: '주간 팀 회의 요약\n\n참석자: 김철수, 이영희, 박민수\n주제: Q4 목표 검토\n\n작성 시간: ' + new Date().toLocaleString('ko-KR')
    },
    {
      category: 'BRIEFING',
      emoji: '📰',
      title: '일일 브리핑',
      content: '오늘의 브리핑\n\n주요 이슈:\n1. 서버 업데이트 완료\n2. 신규 기능 배포 예정\n\n작성 시간: ' + new Date().toLocaleString('ko-KR')
    },
    {
      category: 'HEALTH',
      emoji: '💪',
      title: '건강 기록',
      content: '일일 건강 데이터\n\n걸음 수: 10,000\n수면: 7.5시간\n칼로리: 2,200 kcal\n심박수: 72 bpm\n\n기록 시간: ' + new Date().toLocaleString('ko-KR')
    },
    {
      category: 'MAIL',
      emoji: '📧',
      title: '중요 메일',
      content: '중요 메일 백업\n\n발신: support@company.com\n제목: 시스템 업데이트 안내\n내용: 다음 주 월요일 시스템 점검 예정\n\n저장 시간: ' + new Date().toLocaleString('ko-KR')
    },
    {
      category: 'WEATHER',
      emoji: '☀️',
      title: '날씨 기록',
      content: '오늘의 날씨\n\n온도: 18°C\n습도: 65%\n날씨: 맑음\n바람: 북서풍 3m/s\n\n기록 시간: ' + new Date().toLocaleString('ko-KR')
    },
    {
      category: 'PROJECT',
      emoji: '📊',
      title: '프로젝트 문서',
      content: '프로젝트 진행 상황\n\n프로젝트명: Agent Core\n진행률: 75%\n다음 마일스톤: 12월 1일\n\n업데이트 시간: ' + new Date().toLocaleString('ko-KR')
    }
  ];

  let testNum = 3;
  for (const item of driveCategories) {
    console.log(`\n${item.emoji} 테스트 ${testNum}: ${item.category} (Google Drive)`);
    try {
      const result = await saveCategoryFile(
        item.category,
        item.content,
        item.title
      );
      console.log('✅ 성공!');
      console.log(`   파일명: ${result.fileName}`);
      console.log(`   링크: ${result.webViewLink}`);
      testResults.push({ name: `${item.category} (Drive)`, status: '✅', details: result.fileName });
    } catch (error: any) {
      console.error('❌ 실패:', error.message);
      testResults.push({ name: `${item.category} (Drive)`, status: '❌', details: error.message });
    }
    testNum++;
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
    console.log('🎉 모든 9개 카테고리 테스트를 통과했습니다!');
    console.log('\n📌 확인하기:');
    console.log('   Google Drive: https://drive.google.com/drive/my-drive');
    console.log('   Google Calendar: https://calendar.google.com');
    console.log('\n📁 생성된 폴더:');
    console.log('   - AGENT-CORE/NOTES');
    console.log('   - AGENT-CORE/MEETINGS');
    console.log('   - AGENT-CORE/BRIEFING');
    console.log('   - AGENT-CORE/HEALTH');
    console.log('   - AGENT-CORE/MAIL');
    console.log('   - AGENT-CORE/WEATHER');
    console.log('   - AGENT-CORE/PROJECT');
    console.log('\n📅 생성된 Calendar 항목:');
    console.log('   - 일정 (SCHEDULE): 팀 미팅');
    console.log('   - 할일 (TASKS): 📋 프로젝트 마감\n');
  }
}

testAll9Categories().catch(console.error);
