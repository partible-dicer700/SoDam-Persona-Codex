# SoDam Persona for Codex

SoDam Persona is a Korean AI development-partner plugin for Codex. It bundles two lifecycle hooks that keep the core persona active and Skills (9) that load only when relevant.

## What it provides

- Always-on core: a `SessionStart` hook injects development principles, response levels, and multi-perspective review rules.
- Per-prompt recovery: a `UserPromptSubmit` hook injects the compact trigger map and self-check rules.
- Conditional expertise: format, safety, triggers, investing, legal, accounting/tax, and marketing/sales skills.
- Editing workflows: `$persona-create` and `$persona-edit` add personas or maintain trigger words.
- Dependency-free validation through `node validate.mjs`.

The current package contains 15 perspectives, 20 trigger patterns (A-T), 9 skills, and 2 hooks.

## Requirements

- A current Codex CLI or Codex desktop app
- Node.js 18 or newer for hooks and validation
- Git when installing from a GitHub marketplace source

## Install

From GitHub:

```powershell
codex plugin marketplace add sodam-ai/SoDam-Persona
codex plugin add sodam-persona@sodam-persona
```

From a local checkout, run these commands at the repository root:

```powershell
codex plugin marketplace add .
codex plugin add sodam-persona@sodam-persona
```

Start a new Codex task after installation. Codex does not automatically trust plugin hooks, so review and approve the hook definition when prompted.

Check installation with:

```powershell
codex plugin marketplace list
codex plugin list
```

## Use

Ask for work normally. The core hooks run automatically, and Codex loads a specialist skill when the request matches its description. You can also invoke skills explicitly:

```text
$persona-investor Review the loss scenarios in this trading strategy
$persona-lawyer Find risky clauses in these terms
$persona-accountant Review whether this cost is deductible
$persona-marketer Improve this landing-page copy
$persona-create Add a medical-domain persona
$persona-edit Add "rebalancing" to the investor triggers
```

In Codex CLI and the IDE extension, use `/skills` or type `$` to browse available skills.

## Layout

```text
.
├── .agents/plugins/marketplace.json
├── plugins/sodam-persona/
│   ├── .codex-plugin/plugin.json
│   ├── hooks/
│   ├── skills/
│   ├── commands/
│   └── reference/
└── validate.mjs
```

`commands/` preserves the original Claude Code workflow bodies as internal references. Codex reaches them through `$persona-create` and `$persona-edit`; they are no longer host slash commands. The Claude manifests remain only for legacy compatibility and are not used by Codex.

## Validate

Run from the repository root:

```powershell
node validate.mjs
```

To validate the Codex plugin schema with the bundled plugin-creator tooling:

```powershell
python C:\Users\PC\.codex_runtime\skills\.system\plugin-creator\scripts\validate_plugin.py plugins\sodam-persona
```

The repository validator checks skill metadata, perspective and trigger counts, Codex manifests, domain wiring, legal/accounting disclaimers, broken internal references, and accidental personal paths.

## Update or remove

```powershell
codex plugin marketplace upgrade sodam-persona
codex plugin remove sodam-persona
codex plugin add sodam-persona@sodam-persona
```

For a local marketplace, reinstalling and opening a new task is the safest way to pick up cached plugin files and changed hook definitions.

## Security

- Hooks only read fixed text files inside the plugin.
- They do not make network requests, evaluate code, execute child commands, write files, or delete files.
- Plugin hooks run only after Codex's trust review.
- Irreversible actions remain subject to both the persona safety rules and Codex approvals.

## License

Apache License 2.0. See `LICENSE` and `NOTICE`.

This project is not affiliated with or sponsored by OpenAI. Codex and OpenAI are trademarks of their respective owner.
