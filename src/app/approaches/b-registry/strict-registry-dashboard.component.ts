import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardShellComponent } from '../../shared/dashboard-shell.component';
import { DashboardState } from '../../shared/dashboard-state';
import { UnsupportedWidgetComponent } from '../../shared/unsupported-widget.component';
import { StrictWidgetRendererDirective } from './widget-renderer-strict.directive';

/** Approach B · Pattern 1: registry + renderer directive, shared-contract bindings. */
@Component({
  selector: 'app-strict-registry-dashboard',
  imports: [DashboardShellComponent, UnsupportedWidgetComponent, StrictWidgetRendererDirective],
  providers: [DashboardState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-dashboard-shell
      heading="B · Registry + directive · Pattern 1 (strict)"
      summary="Every widget implements WidgetComponentContract, so the directive binds the same inputs on all of them. Only widget, editMode, density, loading and locale are shared — timescale and table/timeline events are deliberately NOT wired: that is the cost of a lowest-common-denominator contract."
    >
      @for (widget of state.widgets(); track widget.id) {
        <ng-container
          [appStrictWidgetRenderer]="widget"
          #renderer="appStrictWidgetRenderer"
          [editMode]="state.editMode()"
          [density]="state.density()"
          [loading]="state.loading()"
          [locale]="state.locale()"
        />
        @if (!renderer.hasComponent()) {
          <app-unsupported-widget [type]="$any(widget).type" />
        }
      }
    </app-dashboard-shell>
  `,
})
export class StrictRegistryDashboardComponent {
  protected readonly state = inject(DashboardState);
}
