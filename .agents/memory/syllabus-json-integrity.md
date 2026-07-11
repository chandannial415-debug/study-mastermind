---
name: syllabus-json-integrity
description: Invalid JSON in syllabus.json causes a silent blank white screen in the Expo web app — no React error overlay, no Metro error, bundle compiles fine.
---

curriculum.ts imports syllabus.json at module-init time. If the JSON is malformed, the whole JS bundle crashes before React mounts, producing a blank white screen with no visible error.

**Why:** Metro bundles JSON imports statically. A parse error at runtime (not compile time) silently kills the module, and since curriculum.ts is in the root import tree, the entire React tree never mounts.

**How to apply:** After any edit to syllabus.json, validate it immediately with:
```
node -e "require('./src/data/syllabus.json'); console.log('valid')"
```
The historical bug was a missing closing `"` on the name field of chapter "phy-9" (line 221), introduced by a previous agent session that truncated a multi-byte Odia character string.
