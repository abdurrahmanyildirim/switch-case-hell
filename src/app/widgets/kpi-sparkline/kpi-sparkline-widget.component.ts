import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {
  lastHours,
  polyline,
  type KpiSparklineWidget,
  type Timescale,
  type Density,
} from '../widget.model';

/** Inputs: widget, editMode, density, loading, locale, timescale. */
@Component({
  selector: 'app-kpi-sparkline-widget',
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'widget',
    '[class.editing]': 'editMode()',
    '[class.compact]': 'density() === "compact"',
    '[class.loading]': 'loading()',
    '[attr.lang]': 'locale()',
  },
  template: `
    <header>
      {{ widget().title }} <span class="tag">{{ timescale() }}</span>
    </header>
    <div class="value">
      {{ total() | number: '1.0-0' }} <small>{{ widget().data.unit }}</small>
    </div>
    <svg viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
      <polyline [attr.points]="points()" />
    </svg>
  `,
  styles: `
    .value {
      font-size: 1.8rem;
      font-weight: 600;
    }
    .value small {
      font-size: 0.9rem;
      color: var(--muted);
    }
    svg {
      width: 100%;
      height: 2.5rem;
    }
    polyline {
      fill: none;
      stroke: var(--accent);
      stroke-width: 1.5;
      vector-effect: non-scaling-stroke;
    }
  `,
})
export class KpiSparklineWidgetComponent {
  readonly widget = input.required<KpiSparklineWidget>();
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');
  readonly timescale = input<Timescale>('24h');

  private readonly window = computed(() => lastHours(this.widget().data.hourly, this.timescale()));
  protected readonly total = computed(() => this.window().reduce((a, b) => a + b, 0));
  protected readonly points = computed(() => polyline(this.window(), 100, 20));
}
