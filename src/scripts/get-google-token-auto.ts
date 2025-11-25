import express from 'express';
import open from 'open';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/api/auth/callback/google';
const PORT = 3000;

const SCOPES = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/calendar',
];

async function getRefreshTokenWithServer() {
    console.log('\n🔐 Google OAuth Refresh Token 자동 발급 도구\n');
    console.log('='.repeat(60));

    if (!CLIENT_ID || !CLIENT_SECRET) {
        console.error('\n❌ 오류: GOOGLE_CLIENT_ID 또는 GOOGLE_CLIENT_SECRET이 설정되지 않았습니다.\n');
        process.exit(1);
    }

    const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent',
    });

    // Express 서버 생성
    const app = express();
    let server: any;

    const tokenPromise = new Promise<string>((resolve, reject) => {
        app.get('/api/auth/callback/google', async (req, res) => {
            const code = req.query.code as string;

            if (!code) {
                res.send('❌ 인증 코드를 받지 못했습니다. 창을 닫고 다시 시도하세요.');
                reject(new Error('No code received'));
                return;
            }

            try {
                const { tokens } = await oAuth2Client.getToken(code);

                if (!tokens.refresh_token) {
                    res.send('❌ Refresh Token을 받지 못했습니다. 창을 닫고 다시 시도하세요.');
                    reject(new Error('No refresh token'));
                    return;
                }

                // .env 파일 업데이트
                const envPath = path.join(process.cwd(), '.env');
                let envContent = fs.readFileSync(envPath, 'utf-8');

                if (envContent.includes('GOOGLE_REFRESH_TOKEN=')) {
                    envContent = envContent.replace(
                        /GOOGLE_REFRESH_TOKEN=.*/,
                        `GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`
                    );
                } else {
                    envContent += `\nGOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`;
                }

                fs.writeFileSync(envPath, envContent);

                res.send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>인증 완료</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              }
              .container {
                background: white;
                padding: 40px;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                text-align: center;
              }
              h1 { color: #667eea; margin-bottom: 20px; }
              p { color: #4a5568; font-size: 18px; line-height: 1.6; }
              .success { font-size: 64px; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="success">✅</div>
              <h1>인증 완료!</h1>
              <p>Refresh Token이 성공적으로 발급되었습니다.</p>
              <p>.env 파일에 자동으로 저장되었습니다.</p>
              <p><strong>이 창을 닫으셔도 됩니다.</strong></p>
            </div>
          </body>
          </html>
        `);

                resolve(tokens.refresh_token);

                // 서버 종료
                setTimeout(() => {
                    server.close();
                }, 2000);

            } catch (error: any) {
                res.send(`❌ 오류 발생: ${error.message}. 창을 닫고 다시 시도하세요.`);
                reject(error);
            }
        });

        server = app.listen(PORT, () => {
            console.log(`\n✅ 로컬 서버가 포트 ${PORT}에서 실행 중입니다.`);
            console.log('\n🌐 브라우저가 자동으로 열립니다...\n');
            console.log('='.repeat(60));

            // 브라우저 자동 열기
            open(authUrl).catch(() => {
                console.log('\n⚠️  브라우저를 자동으로 열 수 없습니다.');
                console.log('다음 URL을 수동으로 열어주세요:\n');
                console.log(authUrl);
                console.log('\n' + '='.repeat(60));
            });
        });
    });

    try {
        const refreshToken = await tokenPromise;

        console.log('\n' + '='.repeat(60));
        console.log('\n🎉 설정 완료!\n');
        console.log('✅ Refresh Token이 .env 파일에 저장되었습니다.');
        console.log('\n📌 다음 명령어로 연결을 테스트하세요:');
        console.log('   npx tsx src/scripts/test-google-connection.ts\n');

    } catch (error: any) {
        console.error('\n❌ 오류 발생:', error.message);
        server?.close();
        process.exit(1);
    }
}

getRefreshTokenWithServer().catch(console.error);
