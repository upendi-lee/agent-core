import { classifyCommand } from '../ai/flows/classify-command';
import * as dotenv from 'dotenv';

dotenv.config();

async function testCommandCenter() {
    const testCases = [
        { command: "내일 오후 2시에 회의 잡아줘", expected: "SCHEDULE" },
        { command: "우유랑 계란 사기 메모해줘", expected: "NOTES" },
        { command: "오늘 할 일 뭐 있지?", expected: "TASKS" },
        { command: "지난 회의 요약해줘", expected: "MEETINGS" },
        { command: "오늘 브리핑 해줘", expected: "BRIEFING" },
        { command: "오늘 걷기 운동 얼마나 했어?", expected: "HEALTH" },
        { command: "안읽은 메일 확인해줘", expected: "MAIL" },
        { command: "내일 서울 날씨 어때?", expected: "WEATHER" },
        { command: "새로운 프로젝트 생성해줘", expected: "PROJECT" },
        { command: "안녕하세요", expected: "UNKNOWN" } // Or potentially BRIEFING depending on AI
    ];

    console.log("Starting Command Center Verification...\n");

    for (const test of testCases) {
        try {
            console.log(`Testing command: "${test.command}"`);
            const result = await classifyCommand({ command: test.command });
            console.log(`  -> Classified as: ${result.category}`);

            if (result.category === test.expected) {
                console.log(`  ✅ PASS`);
            } else {
                console.log(`  ⚠️  WARNING: Expected ${test.expected}, got ${result.category}`);
            }
        } catch (error) {
            console.error(`  ❌ ERROR:`, error);
        }
        console.log('---');
    }
}

testCommandCenter();
