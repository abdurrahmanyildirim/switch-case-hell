import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardShellComponent } from '../../shared/dashboard-shell.component';
import { DashboardState } from '../../shared/dashboard-state';
import { UnsupportedWidgetComponent } from '../../shared/unsupported-widget.component';
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

/** Approach A: Angular control flow — one `@case` per widget type. */
@Component({
  selector: 'app-switch-dashboard',
  imports: [
    DashboardShellComponent,
    UnsupportedWidgetComponent,

    // WIDGETS — every new type is added here as well as in the template.
    StatsCardWidgetComponent,
    ChartWidgetComponent,
    TableWidgetComponent,
    TimelineWidgetComponent,
    GaugeWidgetComponent,
    HeatmapWidgetComponent,
    ScatterWidgetComponent,
    DurationCurveWidgetComponent,
    CategoryBarWidgetComponent,
    DonutWidgetComponent,
    KpiSparklineWidgetComponent,
    TextWidgetComponent,
    ImageWidgetComponent,
    AlarmListWidgetComponent,
    TargetProgressWidgetComponent,
    StatusGridWidgetComponent,
    WeatherWidgetComponent,
    PeriodComparisonWidgetComponent,
    SetpointWidgetComponent,
    ForecastWidgetComponent,
  ],
  providers: [DashboardState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './switch-dashboard.component.html',
})
export class SwitchDashboardComponent {
  protected readonly state = inject(DashboardState);
}
