---
description: How to obtain Firebase Project ID and Service Account Key
---

# Firebase Project ID 및 Service Account Key 발급 방법

1.  **Firebase Console 접속**
    *   [https://console.firebase.google.com/](https://console.firebase.google.com/) 으로 이동하여 로그인합니다.

2.  **프로젝트 선택**
    *   사용 중인 프로젝트를 클릭합니다. (없으면 '프로젝트 추가'로 생성)

3.  **프로젝트 ID 확인**
    *   좌측 상단 **프로젝트 개요(Project Overview)** 옆의 톱니바퀴 아이콘(⚙️)을 클릭하고 **프로젝트 설정(Project settings)**을 선택합니다.
    *   **일반(General)** 탭에서 **프로젝트 ID(Project ID)**를 확인하고 복사합니다.
    *   `.env` 파일의 `FIREBASE_PROJECT_ID`에 붙여넣습니다.

4.  **서비스 계정 키(Service Account Key) 생성**
    *   같은 설정 페이지에서 **서비스 계정(Service accounts)** 탭을 클릭합니다.
    *   하단의 **새 비공개 키 생성(Generate new private key)** 버튼을 클릭합니다.
    *   경고 팝업에서 **키 생성(Generate key)**을 다시 클릭합니다.
    *   `.json` 파일이 다운로드됩니다.

5.  **키 값을 .env에 적용**
    *   다운로드된 `.json` 파일을 메모장이나 코드 에디터로 엽니다.
    *   **중요:** 파일의 전체 내용(중괄호 `{` 부터 `}` 까지)을 복사합니다.
    *   `.env` 파일의 `FIREBASE_SERVICE_ACCOUNT_KEY` 값으로 붙여넣습니다.
    *   **주의:** `.env` 파일에서는 줄바꿈이 있으면 안 되므로, 전체 JSON 내용을 **한 줄로** 만들어서 붙여넣어야 합니다. (또는 따옴표 `'` 로 감싸서 처리)

    *   **팁:** JSON을 한 줄로 만드는 것이 어렵다면, 아래 사이트 등을 이용해 'Minify' 하거나 줄바꿈을 제거하세요.
        *   [JSON Minifier](https://jsonformatter.org/json-minify)
