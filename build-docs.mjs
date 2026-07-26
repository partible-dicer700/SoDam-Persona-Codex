#!/usr/bin/env node
/**
 * SoDam-Persona 문서 HTML 재생성기 (자기완결 — Node 내장 + pandoc만 사용)
 *
 * 목적: README/GUIDE(한/영) 4개 .md → .html 변환을 재현 가능한 명령으로 고정한다.
 *       기존 HTML 4개는 이 정확한 커맨드로 생성된 것을 diff 0줄로 검증 완료(2026-07-26).
 *
 * 사용: node build-docs.mjs   (저장소 루트에서. pandoc 필요 — 없으면 안내 후 종료코드 1)
 *
 * 전제: pandoc 미설치는 플러그인 "사용"에는 무관하다(README §3 필요 프로그램에 pandoc 없음).
 *       이 스크립트는 "문서 본문을 고친 사람"만 실행하면 된다.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const P = (...p) => join(ROOT, ...p);
const THEME = P('doc-theme.html');

const DOCS = [
  { src: 'README.md', out: 'README.html', title: 'SoDam-Persona — README (한국어)' },
  { src: 'GUIDE.md', out: 'GUIDE.html', title: 'SoDam-Persona — 가이드 (한국어)' },
  { src: 'README.en.md', out: 'README.en.html', title: 'SoDam-Persona — README (English)' },
  { src: 'GUIDE.en.md', out: 'GUIDE.en.html', title: 'SoDam-Persona — Guide (English)' },
];

try {
  execFileSync('pandoc', ['--version'], { stdio: 'ignore' });
} catch {
  console.log('❌ pandoc이 설치되어 있지 않습니다.');
  console.log('   문서 본문을 고쳤을 때만 필요합니다 (플러그인 "사용"에는 불필요).');
  console.log('   설치: https://pandoc.org/installing.html');
  process.exit(1);
}

if (!existsSync(THEME)) {
  console.log(`❌ 테마 파일 없음: ${THEME}`);
  process.exit(1);
}

let failed = 0;
for (const { src, out, title } of DOCS) {
  const srcPath = P(src);
  if (!existsSync(srcPath)) {
    console.log(`❌ 원본 없음: ${src}`);
    failed++;
    continue;
  }
  try {
    execFileSync('pandoc', [
      srcPath,
      '-f', 'gfm',
      '--standalone',
      '--include-in-header', THEME,
      '--metadata', `title=${title}`,
      '-o', P(out),
    ]);
    console.log(`✅ ${src} → ${out}`);
  } catch (e) {
    console.log(`❌ 변환 실패 (${src}): ${e.message}`);
    failed++;
  }
}

if (failed > 0) {
  console.log(`\n❌ FAIL — ${failed}건 실패`);
  process.exit(1);
} else {
  console.log('\n✅ PASS — 4개 문서 모두 재생성 완료. git diff로 변경 여부 확인 권장.');
  process.exit(0);
}
