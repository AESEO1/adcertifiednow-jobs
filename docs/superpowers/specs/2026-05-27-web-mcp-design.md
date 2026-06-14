# Chrome Web MCP Integration — Design Spec

**Date:** 2026-05-27  
**Project:** Jobsite (Next.js 14, Supabase, D:\jobsite)  
**Scope:** 10 AI features using Chrome's built-in Gemini Nano via `window.ai`

---

## Overview

Integrate Chrome's Web MCP (`window.ai` / Prompt API) across the jobsite to improve candidate and employer experience at zero ongoing cost. All features are progressive enhancement — if `window.ai` is unavailable (non-Chrome, model not downloaded), the UI is identical to the current state. No errors, no fallbacks, no API calls.

Requires Chrome 127+ with Gemini Nano downloaded (~1.7GB, one-time prompt from browser).

---

## Architecture

### Shared Infrastructure

**`types/ai.d.ts`** — Ambient TypeScript declaration for `window.ai`:
```ts
interface AILanguageModelSession {
  prompt(input: string): Promise<string>
  promptStreaming(input: string): ReadableStream
  destroy(): void
}
interface AILanguageModel {
  availability(): Promise<'available' | 'downloading' | 'unavailable'>
  create(options?: { systemPrompt?: string }): Promise<AILanguageModelSession>
}
interface AI {
  languageModel: AILanguageModel
}
declare global {
  interface Window { ai?: AI }
}
```

**`lib/ai.ts`** — Shared utility:
- `isAIAvailable(): Promise<boolean>` — checks `window.ai?.languageModel.availability() === 'available'`
- `promptAI(prompt: string): Promise<string>` — creates session, prompts, destroys
- `streamAI(prompt: string): Promise<ReadableStream>` — for streaming responses (summary, CV match)

All functions are client-only (guard with `typeof window !== 'undefined'`).

### Component Structure

All AI components live in `components/ai/`. Each:
- Calls `isAIAvailable()` on mount; returns `null` if false
- Shows a subtle loading skeleton while AI processes
- Handles errors silently (returns null on failure)

---

## Features

### Job Detail Page (`app/jobs/[id]/JobClientPage.tsx`)

#### Feature 8 — Job Summary card
**Component:** `components/ai/JobSummary.tsx`  
**Location:** New card inserted between the Job Header card and the "Match my CV" button  
**Behaviour:** On mount, streams 3 bullet-point summary from `job.description`. Bullets appear one by one as they stream. Card has subtle "✨ AI Summary" label.  
**Prompt:** `"Summarise this job description in exactly 3 bullet points, each under 15 words. Return as a plain list, no intro text: [description]"`

#### Feature 1 — CV Matcher button + card
**Component:** `components/ai/CVMatcher.tsx`  
**Button location:** Immediately before the Job Description card — only renders if `isAIAvailable()`  
**Button:** Small outlined button "Match my CV ↓" — onClick calls `document.getElementById('cv-matcher')?.scrollIntoView({ behavior: 'smooth' })`  
**Card location:** Below the bottom Apply button, `id="cv-matcher"`  
**Card contents:**
- Textarea: "Paste your CV here"
- "Check Match" button
- On submit: streams score (0–100%) + bullet list of matching skills + bullet list of gaps
- No data leaves the browser  
**Prompt:** `"Score this CV against this job description. Return: 1) A percentage match score 2) Up to 5 matching skills 3) Up to 5 skill gaps. CV: [cv] Job Description: [jd]"`

#### Feature 2 — Skills Extractor
**Component:** `components/ai/SkillsBadges.tsx`  
**Location:** Appended to existing `getJobTags()` badges in the Job Header card  
**Behaviour:** On mount, extracts skills from description, renders as additional `<Badge variant="secondary">` elements with a subtle separator  
**Prompt:** `"Extract up to 8 required skills or technologies from this job description. Return as a JSON array of short strings only, no explanation: [description]"`

#### Feature 3 — Salary Interpreter
**Location:** Inline enhancement in `JobClientPage.tsx` salary row  
**Behaviour:** Only runs when `!job.salary_display`. Queries description for salary mention, renders extracted value in the existing salary `<dd>` with an "~" prefix to indicate AI-extracted  
**Prompt:** `"Find any salary, pay rate, or compensation mentioned in this text. Return it in format '£X - £Y per year' or '$X per hour' etc. Return null if none found. Text: [description]"`

#### Feature 4 — Remote/Hybrid Detection
**Location:** Inline enhancement in `JobClientPage.tsx` Remote Work row  
**Behaviour:** Replaces the current title-only check (`job.title.includes('remote')`) with AI reading of the full description  
**Prompt:** `"Does this job allow remote work? Reply with exactly one word: Remote, Hybrid, or On-site. Description: [description]"`

#### Feature 5 — Seniority Detection
**Component:** `components/ai/SeniorityBadge.tsx`  
**Location:** New row in Job Summary sidebar, below Category  
**Behaviour:** Reads title + description, returns Junior/Mid/Senior/Lead, renders as a `<Badge>`  
**Prompt:** `"What seniority level is this job? Reply with exactly one word: Junior, Mid, Senior, or Lead. Title: [title] Description: [description]"`

---

### Search Pages (`HeroSearchForm.tsx`, `SearchClientPage.tsx`)

#### Feature 6 — Natural Language Search + Feature 7 — Query Expansion
**Component:** `components/ai/AISearchBar.tsx`  
**Location:** Replaces `HeroSearchForm.tsx`; also used in `SearchClientPage.tsx` search bar  
**Behaviour:**
- Small "✨ AI search" toggle link below the standard input
- When AI mode active: placeholder changes to natural language example; on submit, AI parses query into structured params before routing
- Query expansion runs silently on every search (AI mode or not) — expands keywords to synonyms, used in the `q` param as space-separated terms
- Falls back to standard search if `window.ai` unavailable (toggle never shown)

**NL parse prompt:** `"Parse this job search query into JSON with keys: keywords (string), location (string or null), category (string or null), contractType (string or null), minSalary (number or null). Query: [query]"`  
**Expansion prompt:** `"List up to 4 common job title synonyms for '[keyword]' as a JSON array of short strings. Return only the array."`

---

### Post Job Form (`app/post-job/form/PostJobFormClient.tsx`)

#### Feature 9 — Title Normaliser
**Component:** `components/ai/TitleNormaliser.tsx`  
**Location:** Rendered below the job title input field  
**Behaviour:** On blur of title field, if value is non-empty and AI available, shows suggestion chip: "Suggested: [normalised title] — Accept". Click replaces the title input value.  
**Prompt:** `"Normalise this job title to a clean, professional format for job listings. Return only the normalised title, nothing else: [title]"`

#### Feature 10 — Job Description Assistant
**Component:** `components/ai/JobDescriptionAssistant.tsx`  
**Location:** Rendered below the description textarea  
**Behaviour:** 2-second debounce after user stops typing. Shows a small checklist of what's missing from: salary, location, requirements, benefits, contract type, application instructions. Each missing item shown as a subtle tip pill. Disappears when all present.  
**Prompt:** `"Review this job description and list which of these elements are missing: salary, location, requirements, benefits, contract type, application instructions. Return as a JSON array of missing item names only: [description]"`

---

## File Changes Summary

| File | Change |
|---|---|
| `types/ai.d.ts` | **New** — window.ai ambient types |
| `lib/ai.ts` | **New** — isAIAvailable, promptAI, streamAI |
| `components/ai/JobSummary.tsx` | **New** |
| `components/ai/CVMatcher.tsx` | **New** — includes scroll anchor + button |
| `components/ai/SkillsBadges.tsx` | **New** |
| `components/ai/SeniorityBadge.tsx` | **New** |
| `components/ai/AISearchBar.tsx` | **New** — NL search + expansion |
| `components/ai/TitleNormaliser.tsx` | **New** |
| `components/ai/JobDescriptionAssistant.tsx` | **New** |
| `app/jobs/[id]/JobClientPage.tsx` | **Modified** — add AI components, salary + remote enhancements |
| `app/HeroSearchForm.tsx` | **Modified** — use AISearchBar |
| `app/search/SearchClientPage.tsx` | **Modified** — use AISearchBar |
| `app/post-job/form/PostJobFormClient.tsx` | **Modified** — add TitleNormaliser + JobDescriptionAssistant |

---

## Error Handling

- All AI calls wrapped in try/catch — silent failure, component returns null
- `isAIAvailable()` called before any session creation — no errors thrown to user
- Session always destroyed in finally block to prevent memory leaks
- Streaming responses handle ReadableStream cancellation on component unmount

---

## Out of Scope

- No service worker or offline support
- No caching of AI responses (Gemini Nano is fast enough, and descriptions change)
- No server-side AI fallback
- No UI shown to non-Chrome users (pure progressive enhancement)
