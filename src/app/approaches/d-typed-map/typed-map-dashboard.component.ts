import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardShellComponent } from '../../shared/dashboard-shell.component';
import { DashboardState } from '../../shared/dashboard-state';
import { UnsupportedWidgetComponent } from '../../shared/unsupported-widget.component';
import { TypedWidgetRendererDirective } from './typed-widget-renderer.directive';
import { createWidgetDefinitions } from './widget-definitions';

/** Approach D: fully typed TS map (component + every input + every output) per widget type. */
@Component({
  selector: 'app-typed-map-dashboard',
  imports: [DashboardShellComponent, UnsupportedWidgetComponent, TypedWidgetRendererDirective],
  providers: [DashboardState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-dashboard-shell
      heading="D · Typed widget map"
      summary="A TS map built for this dashboard instance: each widget type names its component and must supply every input and output that component declares, with exact types. The template only passes the widget — the map pulls editMode, timescale and event handling from the dashboard."
    >
      @for (widget of state.widgets(); track widget.id) {
        <ng-container
          [appTypedWidgetRenderer]="widget"
          #renderer="appTypedWidgetRenderer"
          [definitions]="definitions"
        />
        @if (!renderer.hasComponent()) {
          <app-unsupported-widget [type]="$any(widget).type" />
        }
      }
    </app-dashboard-shell>
  `,
})
export class TypedMapDashboardComponent {
  protected readonly state = inject(DashboardState);
  protected readonly definitions = createWidgetDefinitions(this.state);
}
