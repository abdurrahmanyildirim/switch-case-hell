import type { Type } from '@angular/core';
import type { WidgetType } from '../widgets/widget.model';

/**
 * Lazy variant of the Pattern 2 registry: each widget becomes its own chunk, loaded on first use.
 * Kept in its own file — importing it must not pull in the eager registry's static imports.
 */
export const WIDGET_LOADERS = {
  STATS: () =>
    import('../widgets/stats-card/stats-card-widget.component').then(
      (m) => m.StatsCardWidgetComponent,
    ),
  CHART: () =>
    import('../widgets/chart/chart-widget.component').then((m) => m.ChartWidgetComponent),
  TABLE: () =>
    import('../widgets/table/table-widget.component').then((m) => m.TableWidgetComponent),
  TIMELINE: () =>
    import('../widgets/timeline/timeline-widget.component').then((m) => m.TimelineWidgetComponent),
  GAUGE: () =>
    import('../widgets/gauge/gauge-widget.component').then((m) => m.GaugeWidgetComponent),
  HEATMAP: () =>
    import('../widgets/heatmap/heatmap-widget.component').then((m) => m.HeatmapWidgetComponent),
  SCATTER: () =>
    import('../widgets/scatter/scatter-widget.component').then((m) => m.ScatterWidgetComponent),
  DURATION_CURVE: () =>
    import('../widgets/duration-curve/duration-curve-widget.component').then(
      (m) => m.DurationCurveWidgetComponent,
    ),
  CATEGORY_BAR: () =>
    import('../widgets/category-bar/category-bar-widget.component').then(
      (m) => m.CategoryBarWidgetComponent,
    ),
  DONUT: () =>
    import('../widgets/donut/donut-widget.component').then((m) => m.DonutWidgetComponent),
  KPI_SPARKLINE: () =>
    import('../widgets/kpi-sparkline/kpi-sparkline-widget.component').then(
      (m) => m.KpiSparklineWidgetComponent,
    ),
  TEXT: () => import('../widgets/text/text-widget.component').then((m) => m.TextWidgetComponent),
  IMAGE: () =>
    import('../widgets/image/image-widget.component').then((m) => m.ImageWidgetComponent),
  ALARM_LIST: () =>
    import('../widgets/alarm-list/alarm-list-widget.component').then(
      (m) => m.AlarmListWidgetComponent,
    ),
  TARGET_PROGRESS: () =>
    import('../widgets/target-progress/target-progress-widget.component').then(
      (m) => m.TargetProgressWidgetComponent,
    ),
  STATUS_GRID: () =>
    import('../widgets/status-grid/status-grid-widget.component').then(
      (m) => m.StatusGridWidgetComponent,
    ),
  WEATHER: () =>
    import('../widgets/weather/weather-widget.component').then((m) => m.WeatherWidgetComponent),
  PERIOD_COMPARISON: () =>
    import('../widgets/period-comparison/period-comparison-widget.component').then(
      (m) => m.PeriodComparisonWidgetComponent,
    ),
  SETPOINT: () =>
    import('../widgets/setpoint/setpoint-widget.component').then((m) => m.SetpointWidgetComponent),
  FORECAST: () =>
    import('../widgets/forecast/forecast-widget.component').then((m) => m.ForecastWidgetComponent),
} satisfies Record<WidgetType, () => Promise<Type<unknown>>>;
