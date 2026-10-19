import type { DashboardState } from '../../shared/dashboard-state';
import { AlarmListWidgetComponent } from '../../widgets/alarm-list/alarm-list-widget.component';
import { CategoryBarWidgetComponent } from '../../widgets/category-bar/category-bar-widget.component';
import { ChartWidgetComponent } from '../../widgets/chart/chart-widget.component';
import { DonutWidgetComponent } from '../../widgets/donut/donut-widget.component';
import { DurationCurveWidgetComponent } from '../../widgets/duration-curve/duration-curve-widget.component';
import { ForecastWidgetComponent } from '../../widgets/forecast/forecast-widget.component';
import { GaugeWidgetComponent } from '../../widgets/gauge/gauge-widget.component';
import { HeatmapWidgetComponent } from '../../widgets/heatmap/heatmap-widget.component';
import { ImageWidgetComponent } from '../../widgets/image/image-widget.component';
import { KpiSparklineWidgetComponent } from '../../widgets/kpi-sparkline/kpi-sparkline-widget.component';
import { PeriodComparisonWidgetComponent } from '../../widgets/period-comparison/period-comparison-widget.component';
import { ScatterWidgetComponent } from '../../widgets/scatter/scatter-widget.component';
import { SetpointWidgetComponent } from '../../widgets/setpoint/setpoint-widget.component';
import { StatsCardWidgetComponent } from '../../widgets/stats-card/stats-card-widget.component';
import { StatusGridWidgetComponent } from '../../widgets/status-grid/status-grid-widget.component';
import { TableWidgetComponent } from '../../widgets/table/table-widget.component';
import { TargetProgressWidgetComponent } from '../../widgets/target-progress/target-progress-widget.component';
import { TextWidgetComponent } from '../../widgets/text/text-widget.component';
import { TimelineWidgetComponent } from '../../widgets/timeline/timeline-widget.component';
import { WeatherWidgetComponent } from '../../widgets/weather/weather-widget.component';
import { defineWidgets } from './widget-definition';

/**
 * Approach D: a fully typed widget map, built for one dashboard instance.
 *
 * Each entry names its component and then MUST provide every input and every output that component
 * declares — with matching value and event types. Missing, extra or mistyped bindings, a missing
 * widget type, or a component whose `widget` input doesn't accept this type's config are all
 * compile errors.
 */
export function createWidgetDefinitions(dashboard: DashboardState) {
  return defineWidgets({
    STATS: {
      component: StatsCardWidgetComponent,
      inputs: {
        widget: (widget) => widget,
        editMode: () => dashboard.editMode(),
        density: () => dashboard.density(),
        loading: () => dashboard.loading(),
        locale: () => dashboard.locale(),
      },
      outputs: {},
    },
    CHART: {
      component: ChartWidgetComponent,
      inputs: {
        widget: (widget) => widget,
        editMode: () => dashboard.editMode(),
        density: () => dashboard.density(),
        loading: () => dashboard.loading(),
        locale: () => dashboard.locale(),
        timescale: () => dashboard.timescale(),
      },
      outputs: {},
    },
    TABLE: {
      component: TableWidgetComponent,
      inputs: {
        widget: (widget) => widget,
        editMode: () => dashboard.editMode(),
        density: () => dashboard.density(),
        loading: () => dashboard.loading(),
        locale: () => dashboard.locale(),
      },
      outputs: { widgetEvent: (event) => dashboard.log(event) },
    },
    TIMELINE: {
      component: TimelineWidgetComponent,
      inputs: {
        widget: (widget) => widget,
        editMode: () => dashboard.editMode(),
        density: () => dashboard.density(),
        loading: () => dashboard.loading(),
        locale: () => dashboard.locale(),
        timescale: () => dashboard.timescale(),
      },
      outputs: { widgetEvent: (event) => dashboard.log(event) },
    },
    GAUGE: {
      component: GaugeWidgetComponent,
      inputs: {
        widget: (widget) => widget,
        editMode: () => dashboard.editMode(),
        density: () => dashboard.density(),
        loading: () => dashboard.loading(),
        locale: () => dashboard.locale(),
      },
      outputs: {},
    },
    HEATMAP: {
      component: HeatmapWidgetComponent,
      inputs: {
        widget: (widget) => widget,
        editMode: () => dashboard.editMode(),
        density: () => dashboard.density(),
        loading: () => dashboard.loading(),
        locale: () => dashboard.locale(),
        timescale: () => dashboard.timescale(),
      },
      outputs: {},
    },
    SCATTER: {
      component: ScatterWidgetComponent,
      inputs: {
        widget: (widget) => widget,
        editMode: () => dashboard.editMode(),
        density: () => dashboard.density(),
        loading: () => dashboard.loading(),
        locale: () => dashboard.locale(),
      },
      outputs: {},
    },
    DURATION_CURVE: {
      component: DurationCurveWidgetComponent,
      inputs: {
        widget: (widget) => widget,
        editMode: () => dashboard.editMode(),
        density: () => dashboard.density(),
        loading: () => dashboard.loading(),
        locale: () => dashboard.locale(),
        timescale: () => dashboard.timescale(),
      },
      outputs: {},
    },
    CATEGORY_BAR: {
      component: CategoryBarWidgetComponent,
      inputs: {
        widget: (widget) => widget,
        editMode: () => dashboard.editMode(),
        density: () => dashboard.density(),
        loading: () => dashboard.loading(),
        locale: () => dashboard.locale(),
      },
      outputs: {},
    },
    DONUT: {
      component: DonutWidgetComponent,
      inputs: {
        widget: (widget) => widget,
        editMode: () => dashboard.editMode(),
        density: () => dashboard.density(),
        loading: () => dashboard.loading(),
        locale: () => dashboard.locale(),
      },
      outputs: {},
    },
    KPI_SPARKLINE: {
      component: KpiSparklineWidgetComponent,
      inputs: {
        widget: (widget) => widget,
        editMode: () => dashboard.editMode(),
        density: () => dashboard.density(),
        loading: () => dashboard.loading(),
        locale: () => dashboard.locale(),
        timescale: () => dashboard.timescale(),
      },
      outputs: {},
    },
    TEXT: {
      component: TextWidgetComponent,
      inputs: {
        widget: (widget) => widget,
        editMode: () => dashboard.editMode(),
        density: () => dashboard.density(),
        loading: () => dashboard.loading(),
        locale: () => dashboard.locale(),
      },
      outputs: {},
    },
    IMAGE: {
      component: ImageWidgetComponent,
      inputs: {
        widget: (widget) => widget,
        editMode: () => dashboard.editMode(),
        density: () => dashboard.density(),
        loading: () => dashboard.loading(),
        locale: () => dashboard.locale(),
      },
      outputs: {},
    },
    ALARM_LIST: {
      component: AlarmListWidgetComponent,
      inputs: {
        widget: (widget) => widget,
        editMode: () => dashboard.editMode(),
        density: () => dashboard.density(),
        loading: () => dashboard.loading(),
        locale: () => dashboard.locale(),
      },
      outputs: { widgetEvent: (event) => dashboard.log(event) },
    },
    TARGET_PROGRESS: {
      component: TargetProgressWidgetComponent,
      inputs: {
        widget: (widget) => widget,
        editMode: () => dashboard.editMode(),
        density: () => dashboard.density(),
        loading: () => dashboard.loading(),
        locale: () => dashboard.locale(),
      },
      outputs: {},
    },
    STATUS_GRID: {
      component: StatusGridWidgetComponent,
      inputs: {
        widget: (widget) => widget,
        editMode: () => dashboard.editMode(),
        density: () => dashboard.density(),
        loading: () => dashboard.loading(),
        locale: () => dashboard.locale(),
      },
      outputs: { widgetEvent: (event) => dashboard.log(event) },
    },
    WEATHER: {
      component: WeatherWidgetComponent,
      inputs: {
        widget: (widget) => widget,
        editMode: () => dashboard.editMode(),
        density: () => dashboard.density(),
        loading: () => dashboard.loading(),
        locale: () => dashboard.locale(),
      },
      outputs: {},
    },
    PERIOD_COMPARISON: {
      component: PeriodComparisonWidgetComponent,
      inputs: {
        widget: (widget) => widget,
        editMode: () => dashboard.editMode(),
        density: () => dashboard.density(),
        loading: () => dashboard.loading(),
        locale: () => dashboard.locale(),
        timescale: () => dashboard.timescale(),
      },
      outputs: {},
    },
    SETPOINT: {
      component: SetpointWidgetComponent,
      inputs: {
        widget: (widget) => widget,
        editMode: () => dashboard.editMode(),
        density: () => dashboard.density(),
        loading: () => dashboard.loading(),
        locale: () => dashboard.locale(),
      },
      outputs: { widgetEvent: (event) => dashboard.log(event) },
    },
    FORECAST: {
      component: ForecastWidgetComponent,
      inputs: {
        widget: (widget) => widget,
        editMode: () => dashboard.editMode(),
        density: () => dashboard.density(),
        loading: () => dashboard.loading(),
        locale: () => dashboard.locale(),
        timescale: () => dashboard.timescale(),
      },
      outputs: {},
    },
  });
}

export type WidgetDefinitions = ReturnType<typeof createWidgetDefinitions>;
