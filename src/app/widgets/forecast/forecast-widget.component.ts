import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  lastHours,
  polyline,
  type ForecastWidget,
  type Timescale,
  type Density,
} from '../widget.model';

/** Inputs: widget, editMode, density, loading, locale, timescale. */
@Component({
  selector: 'app-forecast-widget',
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
      {{ widget().title }} <span class="tag">{{ timescale() }} + 24h</span>
    </header>
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      role="img"
      [attr.aria-label]="widget().title"
    >
      <polyline class="actual" [attr.points]="actualPoints()" />
      <polyline class="forecast" [attr.points]="forecastPoints()" />
      <line [attr.x1]="split()" [attr.x2]="split()" y1="0" y2="40" />
    </svg>
    <div class="legend"><span class="a">actual</span><span class="f">forecast</span></div>
  `,
  styles: `
    svg {
      width: 100%;
      height: 6rem;
    }
    polyline {
      fill: none;
      stroke-width: 1.5;
      vector-effect: non-scaling-stroke;
    }
    .actual {
      stroke: var(--accent);
    }
    .forecast {
      stroke: var(--warn);
      stroke-dasharray: 3 2;
    }
    line {
      stroke: var(--line);
      vector-effect: non-scaling-stroke;
    }
    .legend {
      display: flex;
      gap: 0.75rem;
      font-size: 0.7rem;
      color: var(--muted);
    }
    .a::before,
    .f::before {
      content: '— ';
    }
    .a::before {
      color: var(--accent);
    }
    .f::before {
      color: var(--warn);
    }
  `,
})
export class ForecastWidgetComponent {
  readonly widget = input.required<ForecastWidget>();
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');
  readonly timescale = input<Timescale>('24h');

  private readonly actual = computed(() => lastHours(this.widget().data.actual, this.timescale()));
  private readonly all = computed(() => [...this.actual(), ...this.widget().data.forecast]);
  private readonly max = computed(() => Math.max(...this.all(), 1));
  /** x where actuals end and the forecast begins. */
  protected readonly split = computed(
    () => (100 * (this.actual().length - 1)) / (this.all().length - 1),
  );

  protected readonly actualPoints = computed(() =>
    polyline(this.actual(), this.split(), 40, this.max()),
  );
  protected readonly forecastPoints = computed(() => {
    const series = [this.actual().at(-1) ?? 0, ...this.widget().data.forecast];
    const width = 100 - this.split();
    return polyline(series, width, 40, this.max())
      .split(' ')
      .map((p) => {
        const [x, y] = p.split(',');
        return `${(Number(x) + this.split()).toFixed(2)},${y}`;
      })
      .join(' ');
  });
}
