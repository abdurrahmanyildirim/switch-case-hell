import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  lastHours,
  polyline,
  type DurationCurveWidget,
  type Timescale,
  type Density,
} from '../widget.model';

/** Inputs: widget, editMode, density, loading, locale, timescale. */
@Component({
  selector: 'app-duration-curve-widget',
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
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      role="img"
      [attr.aria-label]="widget().title"
    >
      <polyline [attr.points]="points()" />
    </svg>
    <div class="axis">
      <span>{{ peak() }} {{ widget().data.unit }} peak</span><span>{{ hours() }} h sorted</span>
    </div>
  `,
  styles: `
    svg {
      width: 100%;
      height: 6rem;
    }
    polyline {
      fill: none;
      stroke: var(--accent);
      stroke-width: 1.5;
      vector-effect: non-scaling-stroke;
    }
    .axis {
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: var(--muted);
    }
  `,
})
export class DurationCurveWidgetComponent {
  readonly widget = input.required<DurationCurveWidget>();
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');
  readonly timescale = input<Timescale>('24h');

  /** Load duration curve: the window's hourly values sorted high → low. */
  private readonly sorted = computed(() =>
    [...lastHours(this.widget().data.hourly, this.timescale())].sort((a, b) => b - a),
  );
  protected readonly points = computed(() => polyline(this.sorted()));
  protected readonly peak = computed(() => Math.round(this.sorted()[0] ?? 0));
  protected readonly hours = computed(() => this.sorted().length);
}
