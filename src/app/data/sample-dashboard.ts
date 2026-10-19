import type { Widget, WidgetType } from '../widgets/widget.model';

const SITES = ['Hall A', 'Hall B', 'Chiller plant', 'Cooling tower', 'Data hall 3', 'Boiler room'];

/** Deterministic pseudo-random sequence so every approach renders identical data. */
function seeded(seed: number): () => number {
  let s = (seed * 104729) % 2147483647;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

/** 30 days of hourly values with a day/night profile plus noise. */
function hourly(rnd: () => number, base: number, hours = 720): number[] {
  return Array.from({ length: hours }, (_, h) => {
    const daily = Math.sin(((h % 24) - 6) * (Math.PI / 12));
    return Math.max(0, base + base * 0.4 * daily + base * 0.2 * (rnd() - 0.5));
  });
}

function makeWidget(type: WidgetType, i: number): Widget {
  const rnd = seeded(i + 1);
  const site = SITES[i % SITES.length];
  const id = `w-${i}`;
  switch (type) {
    case 'STATS':
      return {
        id,
        type,
        title: `${site} · power`,
        data: { value: 200 + rnd() * 800, unit: 'kW', delta: rnd() * 20 - 10 },
      };
    case 'CHART':
      return {
        id,
        type,
        title: `${site} · consumption`,
        data: { series: Array.from({ length: 36 }, () => 20 + rnd() * 80), unit: 'kWh' },
      };
    case 'TABLE':
      return {
        id,
        type,
        title: `${site} · assets`,
        data: {
          columns: ['Asset', 'Status', 'COP'],
          rows: Array.from({ length: 4 }, (_, r) => [
            `CH-${i}${r}`,
            rnd() > 0.2 ? 'running' : 'standby',
            (3 + rnd() * 3).toFixed(2),
          ]),
        },
      };
    case 'TIMELINE':
      return {
        id,
        type,
        title: `${site} · events`,
        data: {
          entries: [
            { hoursAgo: 2, label: 'Setpoint optimised', severity: 'info' },
            { hoursAgo: 30, label: 'Pump P2 vibration', severity: 'warn' },
            { hoursAgo: 200, label: 'Chiller trip', severity: 'alarm' },
          ],
        },
      };
    case 'GAUGE':
      return {
        id,
        type,
        title: `${site} · PUE`,
        data: { value: Math.round((1.1 + rnd() * 0.6) * 100) / 100, min: 1, max: 2, unit: '' },
      };
    case 'HEATMAP': {
      const values = hourly(rnd, 50);
      return {
        id,
        type,
        title: `${site} · load profile`,
        data: {
          days: Array.from({ length: 30 }, (_, d) => values.slice(d * 24, d * 24 + 24)),
          unit: 'kW',
        },
      };
    }
    case 'SCATTER':
      return {
        id,
        type,
        title: `${site} · COP vs outdoor temp`,
        data: {
          points: Array.from({ length: 40 }, () => {
            const t = 5 + rnd() * 30;
            return [t, Math.max(1, 7 - t * 0.12 + rnd() * 1.2)] as const;
          }),
          xLabel: 'outdoor °C',
          yLabel: 'COP',
        },
      };
    case 'DURATION_CURVE':
      return {
        id,
        type,
        title: `${site} · load duration`,
        data: { hourly: hourly(rnd, 400), unit: 'kW' },
      };
    case 'CATEGORY_BAR':
      return {
        id,
        type,
        title: `${site} · energy by system`,
        data: {
          items: ['Cooling', 'IT load', 'Lighting', 'Pumps', 'Ventilation'].map((label) => ({
            label,
            value: Math.round(50 + rnd() * 450),
          })),
          unit: 'MWh',
        },
      };
    case 'DONUT':
      return {
        id,
        type,
        title: `${site} · energy sources`,
        data: {
          slices: ['Grid', 'PV', 'CHP', 'Battery'].map((label) => ({
            label,
            value: Math.round(10 + rnd() * 90),
          })),
          unit: '%',
        },
      };
    case 'KPI_SPARKLINE':
      return {
        id,
        type,
        title: `${site} · energy`,
        data: { hourly: hourly(rnd, 120), unit: 'kWh' },
      };
    case 'TEXT':
      return {
        id,
        type,
        title: `${site} · operator notes`,
        data: {
          paragraphs: [
            'Free cooling enabled from 01:00 to 06:00 while outdoor temperature stays below 12 °C.',
            'Chiller CH-2 maintenance scheduled for Friday.',
          ],
        },
      };
    case 'IMAGE':
      return {
        id,
        type,
        title: `${site} · schematic`,
        data: { src: 'plant-schematic.svg', caption: 'Simplified hydraulic schematic' },
      };
    case 'ALARM_LIST':
      return {
        id,
        type,
        title: `${site} · alarms`,
        data: {
          alarms: [
            { asset: 'CH-1', message: 'Condenser pressure high', priority: 'high', minutesAgo: 4 },
            { asset: 'P-3', message: 'Pump vibration', priority: 'medium', minutesAgo: 37 },
            { asset: 'AHU-2', message: 'Filter dirty', priority: 'low', minutesAgo: 180 },
          ],
        },
      };
    case 'TARGET_PROGRESS':
      return {
        id,
        type,
        title: `${site} · savings target`,
        data: { actual: Math.round(600 + rnd() * 700), target: 1000, unit: 'MWh', period: '2026' },
      };
    case 'STATUS_GRID': {
      const states = ['ok', 'ok', 'ok', 'warn', 'fault', 'off'] as const;
      return {
        id,
        type,
        title: `${site} · asset status`,
        data: {
          assets: Array.from({ length: 8 }, (_, a) => ({
            name: `${a < 4 ? 'CH' : 'CT'}-${(a % 4) + 1}`,
            state: states[Math.floor(rnd() * states.length)],
          })),
        },
      };
    }
    case 'WEATHER':
      return {
        id,
        type,
        title: `${site} · weather`,
        data: {
          temperatureC: Math.round(8 + rnd() * 20),
          humidity: Math.round(40 + rnd() * 50),
          forecast: [3, 6, 9, 12, 15, 18].map((hour) => ({
            hour,
            tempC: Math.round(8 + rnd() * 20),
          })),
        },
      };
    case 'PERIOD_COMPARISON':
      return {
        id,
        type,
        title: `${site} · vs previous period`,
        data: { current: hourly(rnd, 300), previous: hourly(rnd, 320), unit: 'kWh' },
      };
    case 'SETPOINT':
      return {
        id,
        type,
        title: `${site} · supply temp setpoint`,
        data: { value: 7, min: 5, max: 14, step: 0.5, unit: '°C' },
      };
    case 'FORECAST': {
      const series = hourly(rnd, 250, 744);
      return {
        id,
        type,
        title: `${site} · load forecast`,
        data: { actual: series.slice(0, 720), forecast: series.slice(720), unit: 'kW' },
      };
    }
  }
}

const TYPES = [
  'STATS',
  'CHART',
  'TABLE',
  'TIMELINE',
  'GAUGE',
  'HEATMAP',
  'SCATTER',
  'DURATION_CURVE',
  'CATEGORY_BAR',
  'DONUT',
  'KPI_SPARKLINE',
  'TEXT',
  'IMAGE',
  'ALARM_LIST',
  'TARGET_PROGRESS',
  'STATUS_GRID',
  'WEATHER',
  'PERIOD_COMPARISON',
  'SETPOINT',
  'FORECAST',
] as const satisfies readonly WidgetType[];

/** Widget count used by the demo dashboards (spec asserts against it): every type twice. */
export const SAMPLE_WIDGET_COUNT = TYPES.length * 2;

/**
 * 40 widgets (each of the 20 types twice), plus one type this build doesn't know —
 * the same situation as a dashboard saved by a newer backend version.
 */
export function createSampleDashboard(): readonly Widget[] {
  const widgets = Array.from({ length: SAMPLE_WIDGET_COUNT }, (_, i) =>
    makeWidget(TYPES[i % TYPES.length], i),
  );
  const unknown = { id: 'w-unknown', type: 'HEATMAP_3D', title: 'Heatmap 3D', data: {} };
  return [...widgets, unknown as unknown as Widget];
}
