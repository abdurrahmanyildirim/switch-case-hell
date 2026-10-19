import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardShellComponent } from '../../shared/dashboard-shell.component';
import { DashboardState } from '../../shared/dashboard-state';
import { UnsupportedWidgetComponent } from '../../shared/unsupported-widget.component';
import { WidgetRendererDirective } from './widget-renderer.directive';

/** Approach B · Pattern 2: registry + renderer directive, reflection-based bindings. */
@Component({
  selector: 'app-registry-dashboard',
  imports: [DashboardShellComponent, UnsupportedWidgetComponent, WidgetRendererDirective],
  providers: [DashboardState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-dashboard-shell
      heading="B · Registry + directive · Pattern 2 (flexible)"
      summary="One registry line per widget type. The directive binds only the inputs and outputs each component declares, discovered once per type via reflectComponentType()."
    >
      @for (widget of state.widgets(); track widget.id) {
        <ng-container
          [appWidgetRenderer]="widget"
          #renderer="appWidgetRenderer"
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
export class RegistryDashboardComponent {
  protected readonly state = inject(DashboardState);
}
