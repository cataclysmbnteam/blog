---
title: 기여하기
url: /ko/contributing/
lang: ko
---

블로그 작성에 기여해주셔서 감사합니다!

## 시작하기

### 준비물

- [Git](https://git-scm.com/downloads) (버전 관리 도구)
- [Deno](https://docs.deno.com/runtime/manual) (자바스크립트/타입스크립트 런타임, 개발 서버 구동에 사용)
- [VSCode](https://code.visualstudio.com) (코드 에디터)

### 프로젝트 설정

저장소를 클론합니다.

```sh
$ git clone https://github.com/scarf005/bn-blog
$ cd bn-blog
```

프로젝트를 에디터에서 엽니다. (또는: `code .`)

### 개발 서버 실행

```sh
$ deno task serve
```

`serve` 태스크를 실행해 개발 서버를 시작합니다. 브라우저에서 <http://localhost:3000/ko/>을 열어 확인하세요.

### 웹사이트 빌드

```sh
$ deno task build
$ deno run -A https://deno.land/std/http/file_server.ts _site
```

`build` 태스크로 `_site` 경로에 웹사이트를 빌드합니다. `file_server.ts` 스크립트로 파일 서버를 실행해 빌드된 웹사이트를 확인할 수 있습니다. 브라우저에서 <http://localhost:4507/ko/>을 열어 확인하세요.

## 변경 내역 작성하기

`pages/연도/월/YYYY-MM-DD.md` 형식의 마크다운 파일을 생성해 일 단위로 변경 내역을 작성합니다.

[마크다운 작성법 가이드](https://docs.github.com/ko/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)

<!--
### 사진 첨부

사진이나 동영상이 포함되면 변경 내역을 이해하기 더 쉽습니다. PR에 있는 사진

`https://github.com/cataclysmbnteam/Cataclysm-BN/pull/4277` -->

## PR 만들기

1. `git switch -c 브랜치이름`으로 새 브랜치를 생성합니다.
2. 새로운 Pull Request를 생성합니다.
3. 제목에는 [Conventional Commits](https://www.conventionalcommits.org/ko/v1.0.0/) 형식을 맞춰 간략하게 작성합니다.

### 예시

```
feat(posts/ko): 2024-03-02
```

3월 2일자 변경 내역을 추가한 경우

```
feat(posts/ko): 2024-02, 2024-03
```

2월, 3월에 몇 개의 변경 내역을 추가한 경우
