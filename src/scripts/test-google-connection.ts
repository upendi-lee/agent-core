import { google } from 'googleapis';
import * as dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/google';
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

async function testGoogleConnection() {
    console.log('\n🔍 Google API 연결 테스트\n');
    console.log('='.repeat(60));

    // 1. 환경 변수 확인
    console.log('\n📋 1단계: 환경 변수 확인');

    const missingVars: string[] = [];

    if (!CLIENT_ID) missingVars.push('GOOGLE_CLIENT_ID');
    if (!CLIENT_SECRET) missingVars.push('GOOGLE_CLIENT_SECRET');
    if (!REFRESH_TOKEN) missingVars.push('GOOGLE_REFRESH_TOKEN');

    if (missingVars.length > 0) {
        console.error(`\n❌ 다음 환경 변수가 설정되지 않았습니다:`);
        missingVars.forEach(v => console.error(`   - ${v}`));
        console.log('\n💡 google-oauth-setup-guide.md를 참고하여 설정을 완료하세요.\n');
        process.exit(1);
    }

    console.log('✅ 모든 환경 변수가 설정되었습니다.');
    console.log(`   - GOOGLE_CLIENT_ID: ${CLIENT_ID.substring(0, 20)}...`);
    console.log(`   - GOOGLE_CLIENT_SECRET: ${CLIENT_SECRET.substring(0, 10)}...`);
    console.log(`   - GOOGLE_REFRESH_TOKEN: ${REFRESH_TOKEN.substring(0, 20)}...`);

    // 2. OAuth2 클라이언트 생성
    console.log('\n📋 2단계: OAuth2 클라이언트 생성');

    const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );

    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    console.log('✅ OAuth2 클라이언트 생성 완료');

    // 3. Google Drive API 테스트
    console.log('\n📋 3단계: Google Drive API 연결 테스트');

    try {
        const drive = google.drive({ version: 'v3', auth: oAuth2Client });

        // 드라이브 정보 가져오기
        const aboutRes = await drive.about.get({ fields: 'user, storageQuota' });
        const user = aboutRes.data.user;
        const quota = aboutRes.data.storageQuota;

        console.log('✅ Google Drive API 연결 성공!');
        console.log(`   - 사용자: ${user?.emailAddress}`);
        console.log(`   - 저장공간: ${formatBytes(Number(quota?.usage || 0))} / ${formatBytes(Number(quota?.limit || 0))}`);

    } catch (error: any) {
        console.error('❌ Google Drive API 연결 실패');
        console.error(`   오류: ${error.message}`);
        console.log('\n💡 해결 방법:');
        console.log('   1. Google Cloud Console에서 Drive API가 활성화되었는지 확인');
        console.log('   2. Refresh Token이 올바른지 확인');
        console.log('   3. OAuth 동의 화면에서 테스트 사용자로 추가되었는지 확인\n');
        process.exit(1);
    }

    // 4. Google Calendar API 테스트
    console.log('\n📋 4단계: Google Calendar API 연결 테스트');

    try {
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

        // 캘린더 목록 가져오기
        const calendarListRes = await calendar.calendarList.list();
        const calendars = calendarListRes.data.items || [];

        console.log('✅ Google Calendar API 연결 성공!');
        console.log(`   - 캘린더 개수: ${calendars.length}개`);

        if (calendars.length > 0) {
            console.log('   - 기본 캘린더:', calendars.find(c => c.primary)?.summary || calendars[0].summary);
        }

    } catch (error: any) {
        console.error('❌ Google Calendar API 연결 실패');
        console.error(`   오류: ${error.message}`);
        console.log('\n💡 해결 방법:');
        console.log('   1. Google Cloud Console에서 Calendar API가 활성화되었는지 확인');
        console.log('   2. OAuth 범위에 calendar가 포함되었는지 확인\n');
        process.exit(1);
    }

    // 5. 테스트 폴더 생성 (선택사항)
    console.log('\n📋 5단계: 테스트 폴더 생성 (AGENT-CORE-TEST)');

    try {
        const drive = google.drive({ version: 'v3', auth: oAuth2Client });

        // 테스트 폴더가 이미 있는지 확인
        const searchRes = await drive.files.list({
            q: `mimeType='application/vnd.google-apps.folder' and name='AGENT-CORE-TEST' and trashed=false`,
            fields: 'files(id, name)',
        });

        let folderId: string;

        if (searchRes.data.files && searchRes.data.files.length > 0) {
            folderId = searchRes.data.files[0].id!;
            console.log('✅ 테스트 폴더가 이미 존재합니다.');
        } else {
            // 폴더 생성
            const folderRes = await drive.files.create({
                requestBody: {
                    name: 'AGENT-CORE-TEST',
                    mimeType: 'application/vnd.google-apps.folder',
                },
                fields: 'id, name, webViewLink',
            });

            folderId = folderRes.data.id!;
            console.log('✅ 테스트 폴더 생성 완료!');
            console.log(`   - 폴더 ID: ${folderId}`);
            console.log(`   - 링크: ${folderRes.data.webViewLink}`);
        }

        // 테스트 파일 생성
        const testContent = `테스트 파일 생성 시간: ${new Date().toISOString()}\n\n이 파일은 Google Drive API 연결 테스트를 위해 자동으로 생성되었습니다.`;

        const fileRes = await drive.files.create({
            requestBody: {
                name: `test_${Date.now()}.txt`,
                parents: [folderId],
            },
            media: {
                mimeType: 'text/plain',
                body: testContent,
            },
            fields: 'id, name, webViewLink',
        });

        console.log('✅ 테스트 파일 생성 완료!');
        console.log(`   - 파일 이름: ${fileRes.data.name}`);
        console.log(`   - 링크: ${fileRes.data.webViewLink}`);

    } catch (error: any) {
        console.error('❌ 테스트 폴더/파일 생성 실패');
        console.error(`   오류: ${error.message}`);
    }

    // 완료
    console.log('\n' + '='.repeat(60));
    console.log('\n🎉 모든 테스트를 통과했습니다!');
    console.log('\n✅ Google Drive 및 Calendar API를 사용할 준비가 완료되었습니다.');
    console.log('\n📌 다음 단계:');
    console.log('   - Google Drive에서 AGENT-CORE-TEST 폴더를 확인하세요');
    console.log('   - 이제 실제 기능 구현을 시작할 수 있습니다\n');
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// 스크립트 실행
testGoogleConnection().catch(console.error);
