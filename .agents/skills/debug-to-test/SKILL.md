---
description: Turn a runtime JSON dump of a layout state into a reproducible test case
name: debug-to-test
---

# Debug Data to Test Conversion

Turn a runtime JSON dump of a layout state into a reproducible test case.

## Project Context

- **Test utils**: `tests/utils.ts` (NOT `.js`) — exports `w` (TestWidths) and `createTestWindow()`
- **w constants** are computed from `settings.scale`: `w.full`, `w.half`, `w.third`, `w.forth`, `w.fifth`
- **Test directory**: `tests/bugs/bug-N.test.ts` (next available N; check existing with `search_files(target='files', pattern='bug-.*\.test\.ts')`)
- **Reference test**: `tests/bugs/bug-1.test.ts` — use as template for imports, structure, and patterns

## Imports Template

Every bug test needs these imports:

```ts
import { throwIfError } from "@alanscodelog/utils/throwIfError"
import { walk } from "@alanscodelog/utils/walk"
import { expect, it } from "vitest"

import { validateLayoutShape } from "../../src/runtime/helpers/validateLayoutShape.js"
import { applyFrameChanges } from "../../src/runtime/layout/applyFrameChanges.js"
import { getFrameUndockInfo } from "../../src/runtime/layout/getFrameUndockInfo.js"
// Add other layout functions as needed (getFrameDockInfo, getFrameResizeInfo, etc.)
import { settings } from "../../src/runtime/settings.js"
import type { LayoutChange, LayoutWindow } from "../../src/runtime/types/index.js"
import { createTestWindow, w } from "../utils.js"
```

- All relative imports must end with `.js` (not `.ts`)
- Use `../../src/runtime/...` for source imports (tests are one level deeper)

## When to Use

- User provides a JSON dump of a window/frame state and describes a bug
- Need to reproduce a layout issue in the test suite

## Steps

### 1. Map values to `w` constants

Never hardcode numbers unless asked. Map every `x`, `y`, `width`, `height`, and `collapsed` value to `w` constants from `tests/utils.ts`:

- `100000` → `w.full`
- `50000` → `w.half`
- `33333` → `w.third`
- `25000` → `w.forth`
- `20000` → `w.fifth`

For derived values (e.g. `w.full - collapsedHeight`), compute them with variables:

```ts
const collapsedHeight = settings.getCollapseSizeScaled(testWindow).height
```

### 2. Use `w.half` over `w.third` when possible

Avoid `w.third` unless there are 3 frames exactly on the same axis as it introduces off by one errors that the test must account for by adding + 1 to the width of the last frame.

`w.half` is simpler and easier to debug.

When frames don't need even sizes, use `w.fifth * N` as a substitute (e.g., `w.fifth * 2` for 40000, `w.fifth` for 20000). This avoids the off-by-one issues of `w.third` while allowing non-uniform splits.

### 3. Build the layout object

```ts
const testWindow = createTestWindow()

/*
 * ┌────┬────┬────┐
 * │A*~ │B   │C   │
 * └────┴────┴────┘
 * Describe how the test tests for the bug, for example: Undocking A should not ... if ...
 */

const layout: LayoutWindow = {
	...testWindow,
	frames: {
		A: { id: "A", width: ..., height: ..., x: ..., y: ..., docked: "left", collapsed: ... },
		B: { id: "B", width: ..., height: ..., x: ..., y: ... },
	}
}
```

- Use single-letter IDs (A, B, C, D, E) — not UUIDs from the dump
- Docked frames include `docked` and `collapsed` fields
- Undocked frames omit both
- Always start with `const testWindow = createTestWindow()` then spread it
- ASCII diagram in the comment above should be vague and tiny — use `*` for docked, `~` for collapsed. NO widths, NO numbers, NO coordinates. Just the frame letters and layout shape. They are mean for the user's convenience to get a quick glimpse of the layout
- Do NOT add explanatory comments next to assertions. The assertions speak for themselves.

### 4. Validate initial state

```ts
const clone = walk(layout, undefined, { save: true })
expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
```

Always add `validateLayoutShape` check BEFORE the action. This catches bad test setup early.

Run the test (`vitest run tests/bugs/bug-N.test.ts`). It should PASS at this point, if not you did the layout wrong. 

If you're getting stuck trying to make it pass, add `consoleDebugWindow(clone)` (`src/runtime/helpers/consoleDebugWindow.js`) to the test and tell the user to look at the test so they can visually inspect it, do not use this function yourself, it has ascii layout that will confuse you.

### 5. Add Bug Assertions

After the generic shape validation, assert what was actually broken — specific position/size values that should be correct but aren't.

```ts
const result = throwIfError(getFrameUndockInfo(clone, "A"))
applyFrameChanges(clone, result)

expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
// specific assertions about the bug
expect(clone.frames.A.x).toBe(0)
```

Run the test again. It should FAIL due to the bug, if it does not fail report back to the user IMMEDIATELY, something is wrong with the test setup. At this point, report back to the user for review.


