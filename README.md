# testReactApp

React 화면 + Spring Boot REST 서버로 만든 시험용 업무 앱입니다. dstone-knowledge가 React 화면(SPA)을 분석하는지 시험하려고 만들었습니다.

- 기능: `/app/testApp`, `/app/testNexacroApp`, `/app/testWebSqureApp`과 같습니다. 로그인/로그아웃, 메뉴, 공통코드관리, 회원사관리, 로그인이력, 샘플게시판이 있습니다.
- 화면: React 19, React Router 7, fetch 래퍼, Vite 6. TypeScript(TSX)로 썼습니다.
- 서버: Spring Boot 3.5(Java 21), MyBatis(매퍼 인터페이스 + XML), MySQL. `/api/**` REST만 맡습니다.
- 실행: jar 하나에 화면 빌드 결과가 함께 들어갑니다. 포트는 **7105**, DB는 로컬 MySQL `testReact`입니다.
- 짝: 같은 기능을 Vue로 만든 `/app/testVueApp`(포트 7100)이 있습니다. 서버 코드는 패키지 이름만 다릅니다.

## 1. 바로 실행

```bash
cd /app/testReactApp
bin/startApp.sh        # 화면 빌드(npm, tsc 검사 포함) + 서버 빌드(mvn) + 기동 (http://localhost:7105/)
bin/startApp.sh -n     # 빌드 없이 target/testReact.jar 그대로 기동
bin/statusApp.sh       # RUNNING / STARTING / STOPPED
bin/stopApp.sh
```

로그인 정보는 회사코드 `PRD`, 아이디 `admin`, 비밀번호 `test1234!`입니다.

DB는 처음에 한 번 만듭니다.

```bash
sudo mysql < db/00-init.sql                                                       # DB와 계정 treactapp
mysql -h127.0.0.1 -utreactapp -p'Treactapp1234!' testReact < db/01-schema.sql     # 테이블 (다시 돌리면 비우고 새로 만든다)
mysql -h127.0.0.1 -utreactapp -p'Treactapp1234!' testReact < db/02-seed.sql       # 시험 데이터
```

화면만 고칠 때는 서버를 띄워 둔 채 개발 서버를 쓰면 편합니다. 개발 서버(5174)는 `/api`를 7105로 넘깁니다.

```bash
cd frontend && npm run dev      # http://localhost:5174/
```

## 2. 구조

```
testReactApp/
├── bin/                         startApp.sh, stopApp.sh, statusApp.sh (PID: bin/application.pid)
├── db/                          00-init.sql, 01-schema.sql, 02-seed.sql
├── logs/                        testReact.log(앱 로그), testReact.out(표준 출력)
├── pom.xml                      frontend/dist 를 jar 안 static/ 으로 넣는다
├── src/main/java/com/testreact/ testVueApp 과 같다 (패키지 이름만 다르다)
├── src/main/resources/          application.yml, mapper/{auth,sys,sample}/*Mapper.xml
└── frontend/
    ├── vite.config.ts           @ = src, 개발 서버 /api → 7105
    ├── tsconfig.json            @/* 경로
    └── src/
        ├── main.tsx             AuthProvider + RouterProvider
        ├── router.tsx           createBrowserRouter, handle.title(화면 이름)
        ├── types.ts             API 데이터 모양
        ├── lib/apiClient.ts     fetch 래퍼 (API_BASE = '/api', 401 → 로그인 화면)
        ├── services/            authService, codeService (객체의 메소드), memberService, boardService (export 함수)
        ├── hooks/               useAuth (Context), useCommonCode, useBoardList
        ├── components/          AppLayout, SideMenu, PageTitle, DataGrid
        └── pages/               LoginPage, HomePage, sys/{CodeManage,MemberManage,LoginHist}Page, sample/{BoardList,BoardDetail,BoardForm}Page
```

## 3. 업무 하나가 흐르는 길

공통코드 그룹 조회를 예로 들면 다음 순서로 흐릅니다.

1. `pages/sys/CodeManagePage.tsx`의 `searchGroups()`가 `codeService.listGroups(keyword)`를 부릅니다.
2. `services/codeService.ts`가 `apiClient.get('/sys/code-groups', { keyword })`를 부르고, `lib/apiClient.ts`가 앞에 `/api`를 붙여 `fetch`합니다.
3. `CodeController.list`(`@RequestMapping("/api/sys/code-groups")` + `@GetMapping`) → `CodeService.getCodeGroups` → `CodeMapper.selectCodeGroupList` → `TBCM_COMMON_CODE_GROUP` 순서로 이어집니다.
4. 오류가 나면 `GlobalExceptionHandler`가 `{"message": ...}`로 바꿉니다. 세션이 없으면 `LoginInterceptor`가 401을 돌려주고, `apiClient`가 로그인 화면으로 보냅니다.

## 4. 화면 → API 대응표

dstone-knowledge가 찾아야 할 정답입니다. 화면에서 서버 주소까지 가는 길을 함께 적었습니다.

| 화면 (route) | 부르는 방법 | API |
|---|---|---|
| `LoginPage` (`/login`) | `hooks/useAuth.tsx` `signIn` → `authService.login` | `POST /api/auth/login` |
| `AppLayout` | `useAuth` `signOut` → `authService.logout` | `POST /api/auth/logout` |
| (`AuthProvider`) | `authService.me` | `GET /api/auth/me` |
| `AppLayout` → `SideMenu` | `authService.menus` | `GET /api/menus` |
| `sys/CodeManagePage` (`/sys/codes`) | `codeService` 객체의 메소드, `hooks/useCommonCode` | `GET/POST /api/sys/code-groups`, `PUT/DELETE /api/sys/code-groups/{grpCmmCd}`, `GET/POST …/{grpCmmCd}/codes`, `PUT/DELETE …/codes/{cdVl}`, `GET /api/common/codes/{grpCmmCd}` |
| `sys/MemberManagePage` (`/sys/members`) | `memberService`의 export 함수, `useCommonCode` | `GET/POST /api/sys/members`, `PUT /api/sys/members/{mbId}`, `GET /api/common/codes/{grpCmmCd}` |
| `sys/LoginHistPage` (`/sys/login-hists`) | 서비스 없이 `fetch('/api/sys/login-hists?' + qs)` 직접 호출 | `GET /api/sys/login-hists` |
| `sample/BoardListPage` (`/sample/boards`) | `hooks/useBoardList` → `fetchBoards` | `GET /api/sample/boards` |
| `sample/BoardDetailPage` (`/sample/boards/:seq`) | `fetchBoard`, `deleteBoard` | `GET/DELETE /api/sample/boards/{seq}` |
| `sample/BoardFormPage` (`/sample/boards/new`, `/:seq/edit`) | `import * as boardService` | `GET/POST /api/sample/boards`, `PUT /api/sample/boards/{seq}` |

일부러 섞어 둔 모양은 다음과 같습니다(분석기가 모두 따라가야 합니다).

- 서비스 모듈: 객체 리터럴의 메소드(`export const codeService = { listGroups() {} }`), `export function`, `export const x = (…) =>`
- 주소 글자: 따옴표(`'/sys/members'`), 따옴표 + 이어 붙이기(`'/sys/members/' + member.mbId`), 템플릿 리터럴(`` `/sample/boards/${seq}` ``), 직접 `fetch`할 때는 `/api`가 붙은 전체 주소
- HTTP 메소드: `apiClient.get/post/put/delete` 이름과 `request('GET', …)` 안쪽 함수
- import: 이름 지정, 전체(`import * as boardService`), `@` alias, 타입만 가져오기(`import type`)
- 여러 단계: 화면 → 커스텀 훅/Context → 서비스 → `apiClient` → `fetch`
- 화면 이름: 라우터 `handle.title`, 메뉴 `TBSY_RESOURCE.RESOURCE_URL` = route path
