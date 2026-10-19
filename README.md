# Escaping switch-case hell

Six ways to render a dashboard whose widgets are picked at runtime by a `type` field in Angular, side by side and running. The baseline is a giant `@switch`; the others replace it with a registry, `ngComponentOutlet`, or a typed map.

**Read [GUIDE.md](GUIDE.md) for the full analysis.** This page covers how to run the demo and where things are.

## TL;DR

- At 20 widget types, `@switch` costs 20 edits to add one shared input and conflicts on every new widget PR.
- A registry plus a renderer directive with reflection-based bindings (Approach B, Pattern 2) costs 3 edits for the same input and keeps each widget to one registry line.
- A typed widget map (Approach D) gets full compile-time checking, at about 12 lines per widget.
- `@switch` is still fine for small, stable sets of around 8 types or fewer.

## Quick start

Requires Node.js and npm.

```bash
npm install
npm start          # http://localhost:4200
```

## Routes

Every route renders the same dashboard: 20 widget types, 40 widgets, plus one unknown `HEATMAP_3D` widget that shows the fallback card.

| Route | Approach | Entry point |
|---|---|---|
| `/a-switch` | A · `@switch` | [switch-dashboard.component.html](src/app/approaches/a-switch/switch-dashboard.component.html) |
| `/b-strict` | B · Pattern 1, shared contract | [widget-renderer-strict.directive.ts](src/app/approaches/b-registry/widget-renderer-strict.directive.ts) |
| `/b-flexible` | B · Pattern 2, reflection | [widget-renderer.directive.ts](src/app/approaches/b-registry/widget-renderer.directive.ts) |
| `/b-lazy` | B · Pattern 2, lazy registry | [widget-renderer-lazy.directive.ts](src/app/approaches/b-registry/widget-renderer-lazy.directive.ts) |
| `/c-outlet` | C · `ngComponentOutlet` | [outlet-dashboard.component.ts](src/app/approaches/c-outlet/outlet-dashboard.component.ts) |
| `/d-typed-map` | D · Typed widget map | [widget-definitions.ts](src/app/approaches/d-typed-map/widget-definitions.ts) |

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Serves the demo with `ng serve`. |
| `npm run build` | Production build into `dist/`. |
| `npm test` | Runs the specs with Vitest. Every approach must render the same dashboard and behave the same way. |
| `npm run measure` | Builds with stats output and prints the line-count and bundle tables used in [GUIDE.md](GUIDE.md) §4. Add `-- --no-build` to reuse the last build. |

## Project layout

```
src/app/
├── approaches/      One folder per approach (a, b-registry, c-outlet, d-typed-map)
│                    plus approaches.spec.ts, which checks all of them against one contract
├── registry/        Type → component maps (eager and lazy loaders), reflection helpers
├── widgets/         The 20 widget components and the shared widget contract and model
├── shared/          Dashboard shell, shared state, unsupported-widget fallback
└── data/            Sample dashboard used by every route
scripts/measure.mjs  Measures code footprint and bundle cost per approach
```

## What the specs check

For every approach, [approaches.spec.ts](src/app/approaches/approaches.spec.ts) checks:

- **Rendering:** all 40 widgets and one fallback card.
- **Updates in place:** toggling edit mode doesn't re-create widgets.
- **Wiring:** timescale changes and table events reach the widgets. The strict pattern is expected not to wire them, by design.
- **Console:** no `console.error` output, so dev-mode binding warnings fail the test.

Narrower specs guard the gaps that types can't see: [widget-registry.spec.ts](src/app/registry/widget-registry.spec.ts) for input and output names, and [widget-definitions.spec.ts](src/app/approaches/d-typed-map/widget-definitions.spec.ts) for aliased inputs.

## Adding a widget

The approach you use decides the steps. For Approach B with Pattern 2, the checklist is:

1. Add the config type to the `Widget` union in the model.
2. Create the component. Declare only the inputs and outputs it needs, using names from `CANDIDATE_INPUTS` and `CANDIDATE_OUTPUTS`.
3. Add one line to `WIDGET_REGISTRY` (or `WIDGET_LOADERS` for lazy).
4. Run `npm test`. The coverage spec fails if the widget uses an input name the renderer doesn't supply.

The full checklists for B and D are in [GUIDE.md](GUIDE.md) §6.

## Attribution

Built with [Angular](https://angular.dev) 22 and [Vitest](https://vitest.dev). Generated with the [Angular CLI](https://github.com/angular/angular-cli).
