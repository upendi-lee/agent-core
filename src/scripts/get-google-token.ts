import { google } from 'googleapis';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

// .env 파일에서 클라이언트 ID와 시크릿 읽기
import * as dotenv from 'dotenv';
dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/google';

const SCOPES = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/calendar',
];

async function getRefreshToken() {
    console.log('\n🔐 Google OAuth Refresh Token 발급 도구\n');
    console.log('='.repeat(60));

    // 1. 환경 변수 확인
    if (!CLIENT_ID || !CLIENT_SECRET) {
        console.error('\n❌ 오류: GOOGLE_CLIENT_ID 또는 GOOGLE_CLIENT_SECRET이 .env 파일에 설정되지 않았습니다.\n');
        console.log('📝 다음 단계를 먼저 완료하세요:');
        console.log('   1. Google Cloud Console에서 OAuth 2.0 클라이언트 ID 생성');
        console.log('   2. .env 파일에 GOOGLE_CLIENT_ID와 GOOGLE_CLIENT_SECRET 추가\n');
        process.exit(1);
    }

    console.log('✅ 환경 변수 확인 완료\n');
    console.log(`📌 Client ID: ${CLIENT_ID.substring(0, 20)}...`);
    console.log(`📌 Redirect URI: ${REDIRECT_URI}\n`);

    // 2. OAuth2 클라이언트 생성
    const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );

    // 3. 인증 URL 생성
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent', // 항상 refresh token을 받기 위해
    });

    console.log('🔗 다음 URL을 브라우저에서 열어주세요:\n');
    console.log(authUrl);
    console.log('\n' + '='.repeat(60) + '\n');

    // 4. 사용자로부터 인증 코드 입력 받기
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const code = await new Promise<string>((resolve) => {
        rl.question('📋 인증 후 리디렉션된 URL의 "code" 파라미터 값을 붙여넣으세요:\n(예: 4/0A...로 시작하는 긴 문자열)\n\n> ', (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });

    console.log('\n⏳ Refresh Token 발급 중...\n');

    try {
        // 5. 인증 코드로 토큰 교환
        const { tokens } = await oAuth2Client.getToken(code);

        if (!tokens.refresh_token) {
            console.error('\n❌ 오류: Refresh Token을 받지 못했습니다.');
            console.log('\n💡 해결 방법:');
            console.log('   1. Google Cloud Console에서 OAuth 동의 화면으로 이동');
            console.log('   2. 앱을 "테스트" 모드로 설정');
            console.log('   3. 본인의 이메일을 테스트 사용자로 추가');
            console.log('   4. 브라우저에서 Google 계정 로그아웃 후 재시도\n');
            process.exit(1);
        }

        console.log('✅ Refresh Token 발급 성공!\n');
        console.log('📝 Refresh Token:');
        console.log(tokens.refresh_token);
        console.log('\n' + '='.repeat(60) + '\n');

        // 6. .env 파일 업데이트
        const envPath = path.join(process.cwd(), '.env');
        let envContent = '';

        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf-8');
        }

        // GOOGLE_REFRESH_TOKEN이 이미 있으면 업데이트, 없으면 추가
        if (envContent.includes('GOOGLE_REFRESH_TOKEN=')) {
            envContent = envContent.replace(
                /GOOGLE_REFRESH_TOKEN=.*/,
                `GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`
            );
        } else {
            envContent += `\nGOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`;
        }

        fs.writeFileSync(envPath, envContent);

        console.log('✅ .env 파일에 GOOGLE_REFRESH_TOKEN이 저장되었습니다!\n');
        console.log('🎉 설정 완료! 이제 Google Drive 및 Calendar API를 사용할 수 있습니다.\n');
        console.log('📌 다음 명령어로 연결을 테스트하세요:');
        console.log('   npx tsx src/scripts/test-google-connection.ts\n');

    } catch (error: any) {
        console.error('\n❌ 오류 발생:', error.message);
        console.log('\n💡 일반적인 오류 해결 방법:');
        console.log('   1. 인증 코드가 올바른지 확인 (전체 코드를 복사했는지)');
        console.log('   2. 인증 코드는 한 번만 사용 가능 (새로운 코드 발급 필요)');
        console.log('   3. CLIENT_ID와 CLIENT_SECRET이 올바른지 확인\n');
        process.exit(1);
    }
}

// 스크립트 실행
getRefreshToken().catch(console.error);
