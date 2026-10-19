import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TIMESCALE_HOURS, type ChartWidget, type Timescale, type Density } from '../widget.model';

/** Inputs: widget, editMode, density, loading, locale, timescale. */
@Component({
  selector: 'app-chart-widget',
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
      @for (bar of bars(); track $index) {
        <rect [attr.x]="bar.x" [attr.y]="40 - bar.h" [attr.width]="bar.w" [attr.height]="bar.h" />
      }
    </svg>
  `,
  styles: `
    svg {
      width: 100%;
      height: 6rem;
    }
    rect {
      fill: var(--accent);
    }
  `,
})
export class ChartWidgetComponent {
  readonly widget = input.required<ChartWidget>();
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');
  readonly timescale = input<Timescale>('24h');

  /** Longer timescales show more of the series. */
  protected readonly bars = computed(() => {
    const all = this.widget().data.series;
    const count = Math.min(all.length, Math.round(TIMESCALE_HOURS[this.timescale()] / 24) + 6);
    const points = all.slice(-count);
    const max = Math.max(...points, 1);
    const w = 100 / points.length;
    return points.map((v, i) => ({ x: i * w + w * 0.1, w: w * 0.8, h: (v / max) * 38 }));
  });
}
