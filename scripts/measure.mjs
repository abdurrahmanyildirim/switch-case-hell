#!/usr/bin/env node
// Measures code footprint and bundle cost per approach; prints Markdown tables for GUIDE.md.
//   npm run measure              # builds with --stats-json first
//   npm run measure -- --no-build
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist/switch-case-hell/browser');
const STATS = join(ROOT, 'dist/switch-case-hell/browser-stats.json');
const APP = 'src/app';

/** Number of widget types registered today — the footprint below is measured at this size. */
const WIDGET_TYPES = (
  readFileSync(new URL('../src/app/registry/widget-registry.ts', import.meta.url), 'utf8').match(
    /^  [A-Z_]+: \w+WidgetComponent,$/gm,
  ) ?? []
).length;

/** Files that make up each approach (shared widgets/shell/model are excluded — identical for all). */
const APPROACHES = {
  'A · @switch': {
    route: `${APP}/approaches/a-switch/switch-dashboard.component.ts`,
    files: [
      `${APP}/approaches/a-switch/switch-dashboard.component.html`,
      `${APP}/approaches/a-switch/switch-dashboard.component.ts`,
    ],
  },
  'B · strict (P1)': {
    route: `${APP}/approaches/b-registry/strict-registry-dashboard.component.ts`,
    files: [
      `${APP}/approaches/b-registry/strict-registry-dashboard.component.ts`,
      `${APP}/approaches/b-registry/widget-renderer-strict.directive.ts`,
      `${APP}/registry/widget-registry.ts`,
      `${APP}/widgets/widget-contract.ts`,
    ],
  },
  'B · flexible (P2)': {
    route: `${APP}/approaches/b-registry/registry-dashboard.component.ts`,
    files: [
      `${APP}/approaches/b-registry/registry-dashboard.component.ts`,
      `${APP}/approaches/b-registry/widget-renderer.directive.ts`,
      `${APP}/registry/widget-registry.ts`,
      `${APP}/registry/widget-reflection.ts`,
    ],
  },
  'B · lazy (P2)': {
    route: `${APP}/approaches/b-registry/lazy-registry-dashboard.component.ts`,
    files: [
      `${APP}/approaches/b-registry/lazy-registry-dashboard.component.ts`,
      `${APP}/approaches/b-registry/widget-renderer-lazy.directive.ts`,
      `${APP}/registry/widget-loaders.ts`,
      `${APP}/registry/widget-reflection.ts`,
    ],
  },
  'C · ngComponentOutlet': {
    route: `${APP}/approaches/c-outlet/outlet-dashboard.component.ts`,
    files: [
      `${APP}/approaches/c-outlet/outlet-dashboard.component.ts`,
      `${APP}/approaches/c-outlet/outlet-outputs.directive.ts`,
      `${APP}/registry/widget-registry.ts`,
      `${APP}/registry/widget-reflection.ts`,
    ],
  },
  'D · typed map': {
    route: `${APP}/approaches/d-typed-map/typed-map-dashboard.component.ts`,
    files: [
      `${APP}/approaches/d-typed-map/typed-map-dashboard.component.ts`,
      `${APP}/approaches/d-typed-map/typed-widget-renderer.directive.ts`,
      `${APP}/approaches/d-typed-map/widget-definition.ts`,
      `${APP}/approaches/d-typed-map/widget-definitions.ts`,
    ],
  },
};

const read = (f) => readFileSync(join(ROOT, f), 'utf8');

/** Counts non-blank, non-comment lines. */
function sloc(text) {
  const stripped = text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .split('\n')
    .filter((l) => l.trim() && !l.trim().startsWith('//'));
  return stripped.length;
}

/** Splits a file into template lines (HTML file or inline `template:`) and code lines. */
function splitTemplate(file) {
  const text = read(file);
  if (file.endsWith('.html')) return { template: sloc(text), code: 0 };
  const m = text.match(/template: `([\s\S]*?)`,/);
  const template = m ? sloc(m[1]) : 0;
  return { template, code: sloc(m ? text.replace(m[0], '') : text) };
}

const isRegistryFile = (f) =>
  f.includes('/registry/') || f.endsWith('widget-contract.ts') || f.includes('/widget-definition');

function footprint(files) {
  const out = { template: 0, component: 0, registry: 0 };
  for (const f of files) {
    const { template, code } = splitTemplate(f);
    out.template += template;
    if (isRegistryFile(f)) out.registry += code;
    else out.component += code;
  }
  return { ...out, total: out.template + out.component + out.registry };
}

/** Lines a developer adds to the approach's files for one more widget type. */
function marginalLines() {
  const html = read(`${APP}/approaches/a-switch/switch-dashboard.component.html`);
  const caseBlocks = [...html.matchAll(/@case \([^)]*\) \{[\s\S]*?\n {6}\}/g)].map(
    (m) => m[0].split('\n').length + 1, // + the `<!-- TYPE -->` marker line
  );
  const perCase = caseBlocks.reduce((a, b) => a + b, 0) / caseBlocks.length;
  const loaders = read(`${APP}/registry/widget-loaders.ts`);
  const loaderBlock = loaders.slice(loaders.indexOf('= {'), loaders.indexOf('} satisfies'));
  const perLoader = (sloc(loaderBlock) - 1) / WIDGET_TYPES;
  const defs = read(`${APP}/approaches/d-typed-map/widget-definitions.ts`);
  const defsBlock = defs.slice(defs.indexOf('defineWidgets({'), defs.indexOf('  });'));
  const perDefinition = (sloc(defsBlock) - 1) / WIDGET_TYPES;
  return {
    'A · @switch': perCase + 2, // case block + import statement + `imports` entry
    'B · strict (P1)': 2, // registry import + map entry
    'B · flexible (P2)': 2,
    'B · lazy (P2)': perLoader,
    'C · ngComponentOutlet': 2,
    'D · typed map': perDefinition + 1, // map entry + import statement
  };
}

function bundle(stats, route) {
  const outputs = Object.entries(stats.outputs).filter(([k]) => k.endsWith('.js'));
  const byName = new Map(outputs);
  const entry = outputs.find(([, v]) => v.entryPoint === route);
  if (!entry) throw new Error(`No chunk for ${route}`);
  const main = outputs.find(([, v]) => v.entryPoint === 'src/main.ts')[0];

  const closure = (start, kinds) => {
    const seen = new Set();
    const stack = [start];
    while (stack.length) {
      const name = stack.pop();
      if (seen.has(name) || name === main) continue;
      seen.add(name);
      for (const i of byName.get(name).imports) if (kinds.includes(i.kind)) stack.push(i.path);
    }
    return seen;
  };
  const size = (names) => {
    let raw = 0;
    let gz = 0;
    for (const n of names) {
      const buf = readFileSync(join(DIST, n));
      raw += buf.length;
      gz += gzipSync(buf, { level: 9 }).length;
    }
    return { raw, gz };
  };
  const isWidget = (n) =>
    Object.keys(byName.get(n).inputs).some(
      (i) => i.startsWith(`${APP}/widgets/`) && !i.endsWith('widget.model.ts'),
    );

  const eager = closure(entry[0], ['import-statement']);
  const all = closure(entry[0], ['import-statement', 'dynamic-import']);
  const deferred = new Set([...all].filter((n) => !eager.has(n)));
  return {
    eager: size(eager),
    eagerWidgets: size([...eager].filter(isWidget)),
    deferred: size(deferred),
  };
}

const kb = (b) => (b / 1024).toFixed(2);

if (!process.argv.includes('--no-build')) {
  execSync('npx ng build --stats-json', { cwd: ROOT, stdio: 'inherit' });
}
const stats = JSON.parse(readFileSync(STATS, 'utf8'));
const marginal = marginalLines();

console.log('\n### Code footprint (non-blank, non-comment lines; shared widgets/shell excluded)\n');
console.log(
  `| Approach | Template | Component | Registry + renderer | Total @ ${WIDGET_TYPES} types (measured) | +lines per new widget | @ 5 types (projected) | @ 40 types (projected) |`,
);
console.log('|---|--:|--:|--:|--:|--:|--:|--:|');
for (const [name, a] of Object.entries(APPROACHES)) {
  const f = footprint(a.files);
  const m = marginal[name];
  const at = (n) => Math.round(f.total + (n - WIDGET_TYPES) * m);
  console.log(
    `| ${name} | ${f.template} | ${f.component} | ${f.registry} | **${f.total}** | ${m.toFixed(1)} | ${at(5)} | ${at(40)} |`,
  );
}

console.log('\n### Bundle cost of opening the route (excludes the shared `main` chunk; gzip -9)\n');
console.log(
  '| Approach | Route chunks loaded eagerly | …of which widget code | Widget code loaded on demand |',
);
console.log('|---|--:|--:|--:|');
for (const [name, a] of Object.entries(APPROACHES)) {
  const b = bundle(stats, a.route);
  console.log(
    `| ${name} | ${kb(b.eager.raw)} kB (${kb(b.eager.gz)} gz) | ${kb(b.eagerWidgets.raw)} kB | ${b.deferred.raw ? `${kb(b.deferred.raw)} kB` : '—'} |`,
  );
}
