export type Density = 'comfortable' | 'compact';
export type Timescale = '24h' | '7d' | '30d';

interface WidgetBase<T extends string, D> {
  readonly id: string;
  readonly type: T;
  readonly title: string;
  readonly data: D;
}

export type StatsWidget = WidgetBase<'STATS', { value: number; unit: string; delta: number }>;

export type ChartWidget = WidgetBase<'CHART', { series: readonly number[]; unit: string }>;

export type TableWidget = WidgetBase<
  'TABLE',
  { columns: readonly string[]; rows: readonly (readonly (string | number)[])[] }
>;

export interface TimelineEntry {
  readonly hoursAgo: number;
  readonly label: string;
  readonly severity: 'info' | 'warn' | 'alarm';
}

export type TimelineWidget = WidgetBase<'TIMELINE', { entries: readonly TimelineEntry[] }>;

export type GaugeWidget = WidgetBase<
  'GAUGE',
  { value: number; min: number; max: number; unit: string }
>;

export type HeatmapWidget = WidgetBase<
  'HEATMAP',
  {
    /** One row per day (newest last), 24 hourly values each. */ days: readonly (readonly number[])[];
    unit: string;
  }
>;

export type ScatterWidget = WidgetBase<
  'SCATTER',
  { points: readonly (readonly [number, number])[]; xLabel: string; yLabel: string }
>;

export type DurationCurveWidget = WidgetBase<
  'DURATION_CURVE',
  { /** Hourly values, newest last. */ hourly: readonly number[]; unit: string }
>;

export interface LabelledValue {
  readonly label: string;
  readonly value: number;
}

export type CategoryBarWidget = WidgetBase<
  'CATEGORY_BAR',
  { items: readonly LabelledValue[]; unit: string }
>;

export type DonutWidget = WidgetBase<'DONUT', { slices: readonly LabelledValue[]; unit: string }>;

export type KpiSparklineWidget = WidgetBase<
  'KPI_SPARKLINE',
  { /** Hourly values, newest last. */ hourly: readonly number[]; unit: string }
>;

export type TextWidget = WidgetBase<'TEXT', { paragraphs: readonly string[] }>;

export type ImageWidget = WidgetBase<'IMAGE', { src: string; caption: string }>;

export interface Alarm {
  readonly asset: string;
  readonly message: string;
  readonly priority: 'high' | 'medium' | 'low';
  readonly minutesAgo: number;
}

export type AlarmListWidget = WidgetBase<'ALARM_LIST', { alarms: readonly Alarm[] }>;

export type TargetProgressWidget = WidgetBase<
  'TARGET_PROGRESS',
  { actual: number; target: number; unit: string; period: string }
>;

export interface AssetStatus {
  readonly name: string;
  readonly state: 'ok' | 'warn' | 'fault' | 'off';
}

export type StatusGridWidget = WidgetBase<'STATUS_GRID', { assets: readonly AssetStatus[] }>;

export type WeatherWidget = WidgetBase<
  'WEATHER',
  { temperatureC: number; humidity: number; forecast: readonly { hour: number; tempC: number }[] }
>;

export type PeriodComparisonWidget = WidgetBase<
  'PERIOD_COMPARISON',
  {
    /** Hourly values for the current and the previous period, newest last. */
    current: readonly number[];
    previous: readonly number[];
    unit: string;
  }
>;

export type SetpointWidget = WidgetBase<
  'SETPOINT',
  { value: number; min: number; max: number; step: number; unit: string }
>;

export type ForecastWidget = WidgetBase<
  'FORECAST',
  {
    /** Hourly actuals (newest last) followed by hourly forecast values. */
    actual: readonly number[];
    forecast: readonly number[];
    unit: string;
  }
>;

/** Discriminated union of every widget the dashboard knows how to render. */
export type Widget =
  | StatsWidget
  | ChartWidget
  | TableWidget
  | TimelineWidget
  | GaugeWidget
  | HeatmapWidget
  | ScatterWidget
  | DurationCurveWidget
  | CategoryBarWidget
  | DonutWidget
  | KpiSparklineWidget
  | TextWidget
  | ImageWidget
  | AlarmListWidget
  | TargetProgressWidget
  | StatusGridWidget
  | WeatherWidget
  | PeriodComparisonWidget
  | SetpointWidget
  | ForecastWidget;

export type WidgetType = Widget['type'];

/** Narrows the union to the config of one widget type, e.g. `WidgetOf<'GAUGE'>`. */
export type WidgetOf<T extends WidgetType> = Extract<Widget, { type: T }>;

/** Emitted by interactive widgets (table rows, timeline entries, alarms, assets, setpoints). */
export interface WidgetEvent {
  readonly widgetId: string;
  readonly kind:
    'row-select' | 'entry-select' | 'alarm-select' | 'asset-select' | 'setpoint-change';
  readonly label: string;
}

export const TIMESCALE_HOURS: Record<Timescale, number> = { '24h': 24, '7d': 168, '30d': 720 };

/** Last `hours` entries of an hourly series. */
export function lastHours(series: readonly number[], timescale: Timescale): readonly number[] {
  return series.slice(-TIMESCALE_HOURS[timescale]);
}

/** SVG polyline `points` for a series scaled into a `width` × `height` box. */
export function polyline(
  values: readonly number[],
  width = 100,
  height = 40,
  max?: number,
): string {
  const top = max ?? Math.max(...values, 1);
  const step = values.length > 1 ? width / (values.length - 1) : 0;
  return values
    .map((v, i) => `${(i * step).toFixed(2)},${(height - (v / top) * (height - 2)).toFixed(2)}`)
    .join(' ');
}
