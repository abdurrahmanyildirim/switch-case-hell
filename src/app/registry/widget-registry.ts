import type { Type } from '@angular/core';
import { AlarmListWidgetComponent } from '../widgets/alarm-list/alarm-list-widget.component';
import { CategoryBarWidgetComponent } from '../widgets/category-bar/category-bar-widget.component';
import { ChartWidgetComponent } from '../widgets/chart/chart-widget.component';
import { DonutWidgetComponent } from '../widgets/donut/donut-widget.component';
import { DurationCurveWidgetComponent } from '../widgets/duration-curve/duration-curve-widget.component';
import { ForecastWidgetComponent } from '../widgets/forecast/forecast-widget.component';
import { GaugeWidgetComponent } from '../widgets/gauge/gauge-widget.component';
import { HeatmapWidgetComponent } from '../widgets/heatmap/heatmap-widget.component';
import { ImageWidgetComponent } from '../widgets/image/image-widget.component';
import { KpiSparklineWidgetComponent } from '../widgets/kpi-sparkline/kpi-sparkline-widget.component';
import { PeriodComparisonWidgetComponent } from '../widgets/period-comparison/period-comparison-widget.component';
import { ScatterWidgetComponent } from '../widgets/scatter/scatter-widget.component';
import { SetpointWidgetComponent } from '../widgets/setpoint/setpoint-widget.component';
import { StatsCardWidgetComponent } from '../widgets/stats-card/stats-card-widget.component';
import { StatusGridWidgetComponent } from '../widgets/status-grid/status-grid-widget.component';
import { TableWidgetComponent } from '../widgets/table/table-widget.component';
import { TargetProgressWidgetComponent } from '../widgets/target-progress/target-progress-widget.component';
import { TextWidgetComponent } from '../widgets/text/text-widget.component';
import { TimelineWidgetComponent } from '../widgets/timeline/timeline-widget.component';
import { WeatherWidgetComponent } from '../widgets/weather/weather-widget.component';
import type { WidgetComponentContract } from '../widgets/widget-contract';
import type { WidgetOf, WidgetType } from '../widgets/widget.model';

/**
 * Pattern 2 (flexible) registry: type → component.
 *
 * `satisfies Record<WidgetType, …>` makes a missing or misspelled key a compile error, while
 * `Type<unknown>` admits widgets with different inputs (the renderer filters by reflection).
 */
export const WIDGET_REGISTRY = {
  STATS: StatsCardWidgetComponent,
  CHART: ChartWidgetComponent,
  TABLE: TableWidgetComponent,
  TIMELINE: TimelineWidgetComponent,
  GAUGE: GaugeWidgetComponent,
  HEATMAP: HeatmapWidgetComponent,
  SCATTER: ScatterWidgetComponent,
  DURATION_CURVE: DurationCurveWidgetComponent,
  CATEGORY_BAR: CategoryBarWidgetComponent,
  DONUT: DonutWidgetComponent,
  KPI_SPARKLINE: KpiSparklineWidgetComponent,
  TEXT: TextWidgetComponent,
  IMAGE: ImageWidgetComponent,
  ALARM_LIST: AlarmListWidgetComponent,
  TARGET_PROGRESS: TargetProgressWidgetComponent,
  STATUS_GRID: StatusGridWidgetComponent,
  WEATHER: WeatherWidgetComponent,
  PERIOD_COMPARISON: PeriodComparisonWidgetComponent,
  SETPOINT: SetpointWidgetComponent,
  FORECAST: ForecastWidgetComponent,
} satisfies Record<WidgetType, Type<unknown>>;

/**
 * Pattern 1 (strict) registry: each component must implement the shared contract *for its own
 * config type*, so mapping `GAUGE` to the stats card is a compile error.
 */
export const STRICT_WIDGET_REGISTRY: {
  readonly [K in WidgetType]: Type<WidgetComponentContract<WidgetOf<K>>>;
} = WIDGET_REGISTRY;
