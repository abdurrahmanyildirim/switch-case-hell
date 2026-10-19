import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardShellComponent } from '../../shared/dashboard-shell.component';
import { DashboardState } from '../../shared/dashboard-state';
import { UnsupportedWidgetComponent } from '../../shared/unsupported-widget.component';
import { LazyWidgetRendererDirective } from './widget-renderer-lazy.directive';

/** Approach B · Pattern 2 with a lazy registry: each widget type is its own chunk. */
@Component({
  selector: 'app-lazy-registry-dashboard',
  imports: [DashboardShellComponent, UnsupportedWidgetComponent, LazyWidgetRendererDirective],
  providers: [DashboardState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-dashboard-shell
      heading="B · Lazy registry · Pattern 2"
      summary="Same as Pattern 2, but the registry maps types to () => import(...) loaders. Widget code is downloaded only for types present on the dashboard."
    >
      @for (widget of state.widgets(); track widget.id) {
        <ng-container
          [appLazyWidgetRenderer]="widget"
          #renderer="appLazyWidgetRenderer"
          [editMode]="state.editMode()"
          [density]="state.density()"
          [loading]="state.loading()"
          [locale]="state.locale()"
          [timescale]="state.timescale()"
          (widgetEvent)="state.log($event)"
        />
        @if (!renderer.hasComponent()) {
          <app-unsupported-widget [type]="$any(widget).type" />
        }
      }
    </app-dashboard-shell>
  `,
})
export class LazyRegistryDashboardComponent {
  protected readonly state = inject(DashboardState);
}
