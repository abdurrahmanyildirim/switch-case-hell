import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, type Type } from '@angular/core';
import { declaredInputNames } from '../../registry/widget-reflection';
import { WIDGET_REGISTRY } from '../../registry/widget-registry';
import { DashboardShellComponent } from '../../shared/dashboard-shell.component';
import { DashboardState } from '../../shared/dashboard-state';
import { UnsupportedWidgetComponent } from '../../shared/unsupported-widget.component';
import type { Widget } from '../../widgets/widget.model';
import { OutletOutputsDirective } from './outlet-outputs.directive';

interface OutletItem {
  readonly widget: Widget;
  readonly component: Type<unknown> | undefined;
  readonly inputs: Record<string, unknown>;
}

/** Approach C: Angular's built-in `*ngComponentOutlet` with `ngComponentOutletInputs`. */
@Component({
  selector: 'app-outlet-dashboard',
  imports: [
    DashboardShellComponent,
    UnsupportedWidgetComponent,
    NgComponentOutlet,
    OutletOutputsDirective,
  ],
  providers: [DashboardState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-dashboard-shell
      heading="C · *ngComponentOutlet"
      summary="Built-in and zero custom directive code for inputs — but inputs are a plain object applied with setInput() on every change detection, undeclared inputs throw NG0303 (so we still need reflection), and outputs are not supported at all (see OutletOutputsDirective)."
    >
      @for (item of items(); track item.widget.id) {
        @if (item.component) {
          <ng-container
            [ngComponentOutlet]="item.component"
            [ngComponentOutletInputs]="item.inputs"
            (appOutletOutputs)="state.log($event)"
          />
        } @else {
          <app-unsupported-widget [type]="$any(item.widget).type" />
        }
      }
    </app-dashboard-shell>
  `,
})
export class OutletDashboardComponent {
  protected readonly state = inject(DashboardState);

  /**
   * One inputs object per widget. It must only contain inputs the component declares —
   * `setInput()` on an unknown name throws NG0303 — so we filter with the same reflection
   * helper Approach B uses.
   */
  protected readonly items = computed((): readonly OutletItem[] => {
    const shared: Record<string, unknown> = {
      editMode: this.state.editMode(),
      density: this.state.density(),
      loading: this.state.loading(),
      locale: this.state.locale(),
      timescale: this.state.timescale(),
    };
    return this.state.widgets().map((widget) => {
      const component: Type<unknown> | undefined =
        WIDGET_REGISTRY[widget.type as keyof typeof WIDGET_REGISTRY];
      if (!component) return { widget, component, inputs: {} };
      const declared = declaredInputNames(component);
      const inputs = Object.fromEntries(
        Object.entries({ widget, ...shared }).filter(([name]) => declared.has(name)),
      );
      return { widget, component, inputs };
    });
  });
}
