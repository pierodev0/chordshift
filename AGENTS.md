<!-- CODEGRAPH_START -->
## CodeGraph

This project has a CodeGraph MCP server (`codegraph_*` tools) configured. CodeGraph is a tree-sitter-parsed knowledge graph of every symbol, edge, and file. Reads are sub-millisecond and return structural information grep cannot.

Call these directly. They return small results.

0. `codegraph_files` — get project file tree first (fast, gives the map)
1. Targeted lookup — use ONE of these depending on need:
   - `codegraph_search("symbol")` — find a symbol by name
   - `codegraph_callers("fn")` / `codegraph_callees("fn")` — trace call flow
   - `codegraph_impact("symbol")` — check what breaks before editing
   - `codegraph_node("symbol")` — get one symbol's details
2. If Tier 1 isn't enough → spawn a **sub-agent** (Tier 2)
3. If sub-agent result is incomplete → `read(file)` the specific files

Prohibited: calling:`read`, or `grep` directly before exhausting Tier 1.


### When to prefer codegraph over native search

Use codegraph for **structural** questions. Use native grep/read only for **literal text** queries (string contents, comments, log messages).

| Question | Tool | Where |
|---|---|---|
| "Where is X defined?" / "Find symbol named X" | `codegraph_search` | main session |
| "What calls function Y?" | `codegraph_callers` | main session |
| "What does Y call?" | `codegraph_callees` | main session |
| "What would break if I changed Z?" | `codegraph_impact` | main session |
| "Show me Y's signature / source / docstring" | `codegraph_node` | main session |
| "Give me focused context for a task/area" | `codegraph_context` | sub-agent only |
| "Survey an unfamiliar module/topic" | `codegraph_explore` | sub-agent only |
| "What files exist under path/" | `codegraph_files` | main session |
| "Is the index healthy?" | `codegraph_status` | main session |

### Rules of thumb

- **Trust codegraph results.** Full AST parse. Do NOT re-verify with grep.
- **Don't grep or read first** — codegraph ALWAYS comes first.
- **`codegraph_explore` can truncate** — if it clips methods or omits files, go straight to `read` for the missing files (don't call `explore` again).
- **`codegraph_context` is fragile with natural language** (especially non-English). Use concrete symbol names: `"songsStore create"` not `"cómo crear una canción"`.
- **Index lag**: file watcher debounces ~500ms; don't re-query right after editing.

### What NOT to do (real example)

`codegraph_context("add song mp3 flow")` returned almost nothing.

Wrong: `codegraph_context` → `read(SongEditor.vue)` × 4 — wastes tokens, pollutes context.

Right: `codegraph_search("songsStore")` → `codegraph_node("songsStore")` → spawn sub-agent with `"SongEditor useAudioCache songsStore localStorageAdapter explore the create song flow"` → only then `read` specific files.

### If `.codegraph/` doesn't exist

The MCP server returns "not initialized." Ask the user: *"I notice this project doesn't have CodeGraph initialized. Want me to run `codegraph init -i` to build the index?"*

### Bonus: `codegraph affected` (CLI)

Traces import dependencies to find test files affected by changes:

```bash
codegraph affected src/file.ts          # check specific files
git diff --name-only | codegraph affected --stdin --quiet  # CI hook
```
<!-- CODEGRAPH_END -->
