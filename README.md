# SoDam Persona for Codex

Codex에 한국어 AI 개발 파트너 페르소나를 추가하는 플러그인입니다. 세션 시작과 사용자 입력 시 핵심 규칙을 주입하는 hook 2개, 상황에 맞춰 로드되는 상황별 (9개) skill을 묶었습니다.

## 제공 기능

- 항상 켜지는 페르소나 코어: `SessionStart` hook이 개발 원칙, 응답 강도, 다관점 판단 규칙을 주입합니다.
- 매 입력 트리거 복구: `UserPromptSubmit` hook이 트리거 요약과 자가 점검 규칙을 주입합니다.
- 조건부 전문가 skill: 형식, 안전, 트리거, 투자, 법률, 회계·세무, 마케팅·세일즈를 필요한 상황에만 로드합니다.
- 편집 workflow: `$persona-create`, `$persona-edit`로 새 페르소나 생성과 트리거 편집을 진행합니다.
- 자기완결 검증: 외부 패키지 없이 `node validate.mjs`로 구조와 정합성을 검사합니다.

현재 구성은 15명 관점, 트리거 패턴 20개(A~T), skill 9개, hook 2개입니다.

## 요구 사항

- 최신 Codex CLI 또는 Codex 데스크톱 앱
- Node.js 18 이상: hook과 검증 스크립트 실행에 사용
- Git: GitHub marketplace 소스로 설치할 때 사용

## 설치

### GitHub에서 설치

터미널에서 다음을 실행합니다.

```powershell
codex plugin marketplace add sodam-ai/SoDam-Persona
codex plugin add sodam-persona@sodam-persona
```

### 로컬 저장소에서 설치

이 저장소 루트에서 다음을 실행합니다.

```powershell
codex plugin marketplace add .
codex plugin add sodam-persona@sodam-persona
```

설치 후 새 Codex task를 시작합니다. 처음 활성화할 때 Codex가 plugin hook 신뢰 여부를 물으면 내용을 검토한 뒤 허용해야 항상 켜짐 코어가 동작합니다.

설치 상태는 다음 명령으로 확인합니다.

```powershell
codex plugin marketplace list
codex plugin list
```

## 사용

일반 작업은 평소처럼 자연어로 요청하면 됩니다. 페르소나 코어가 자동 적용되고, 요청 내용과 skill description이 맞으면 관련 전문가 skill이 조건부로 로드됩니다.

명시적으로 skill을 호출할 수도 있습니다.

```text
$persona-investor 이 자동매매 로직의 손실 시나리오를 검토해줘
$persona-lawyer 이 서비스 약관의 위험 조항을 찾아줘
$persona-accountant 이 비용을 경비 처리할 수 있는지 검토해줘
$persona-marketer 이 랜딩페이지 카피를 개선해줘
$persona-create 새 의료 도메인 페르소나를 추가해줘
$persona-edit 투자자 트리거에 "리밸런싱"을 추가해줘
```

Codex CLI와 IDE에서는 `/skills` 또는 `$` 입력으로 사용 가능한 skill을 확인할 수 있습니다.

## 구조

```text
.
├── .agents/plugins/marketplace.json
├── plugins/sodam-persona/
│   ├── .codex-plugin/plugin.json
│   ├── hooks/
│   │   ├── hooks.json
│   │   ├── inject-core.js
│   │   ├── inject-marker.js
│   │   ├── persona_core.md
│   │   └── persona_marker.txt
│   ├── skills/
│   │   ├── persona-format/SKILL.md
│   │   ├── persona-safety/SKILL.md
│   │   ├── persona-triggers/SKILL.md
│   │   ├── persona-investor/SKILL.md
│   │   ├── persona-lawyer/SKILL.md
│   │   ├── persona-accountant/SKILL.md
│   │   ├── persona-marketer/SKILL.md
│   │   ├── persona-create/SKILL.md
│   │   └── persona-edit/SKILL.md
│   ├── commands/
│   └── reference/
└── validate.mjs
```

`commands/`는 Claude Code 시절 workflow 본문을 보존한 내부 참조입니다. Codex에서는 이를 직접 slash command로 실행하지 않고 `$persona-create`와 `$persona-edit` skill이 읽어 사용합니다. `plugins/sodam-persona/.claude-plugin/plugin.json`과 루트 `.claude-plugin/marketplace.json`은 이전 호스트 호환용이며 Codex 설치에는 사용하지 않습니다.

## 개발과 검증

변경 후 저장소 루트에서 실행합니다.

```powershell
node validate.mjs
```

Codex plugin 스키마까지 검사하려면 내장 plugin-creator validator를 사용할 수 있습니다.

```powershell
python C:\Users\PC\.codex_runtime\skills\.system\plugin-creator\scripts\validate_plugin.py plugins\sodam-persona
```

검증기는 다음을 확인합니다.

- skill 폴더명과 frontmatter `name` 일치
- 관점 수와 트리거 패턴 수 정합성
- Codex plugin/marketplace JSON과 소스 경로
- 도메인 skill과 코어 파일 연결
- 법률·회계 답변의 면책 규칙
- 깨진 내부 파일 참조와 개인 절대 경로 노출

## 업데이트와 제거

marketplace 소스를 갱신한 뒤 플러그인을 다시 설치합니다.

```powershell
codex plugin marketplace upgrade sodam-persona
codex plugin remove sodam-persona
codex plugin add sodam-persona@sodam-persona
```

로컬 marketplace는 파일 변경을 바로 가리키지만, 설치 캐시와 새 hook 정의를 확실히 반영하려면 제거 후 재설치하고 새 task에서 확인하는 편이 안전합니다.

## 보안

- hook은 plugin 내부의 고정 텍스트 파일만 읽습니다.
- 네트워크 요청, `eval`, 외부 명령 실행, 파일 쓰기·삭제를 하지 않습니다.
- plugin hook은 설치만으로 신뢰되지 않습니다. Codex의 hook 검토 절차를 거쳐야 실행됩니다.
- 배포·삭제·마이그레이션 같은 비가역 작업은 페르소나 안전 규칙과 Codex 승인 정책을 함께 따릅니다.

## 라이선스

Apache License 2.0. 자세한 내용은 `LICENSE`와 `NOTICE`를 참고하세요.

이 프로젝트는 OpenAI와 제휴·후원 관계가 없습니다. Codex와 OpenAI는 각 소유자의 상표입니다.
