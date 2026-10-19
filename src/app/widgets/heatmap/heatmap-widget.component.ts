import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TIMESCALE_HOURS, type HeatmapWidget, type Timescale, type Density } from '../widget.model';

/** Inputs: widget, editMode, density, loading, locale, timescale. */
@Component({
  selector: 'app-heatmap-widget',
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
      [attr.viewBox]="'0 0 24 ' + rows().length"
      preserveAspectRatio="none"
      role="img"
      [attr.aria-label]="widget().title"
    >
      @for (row of rows(); track $index; let y = $index) {
        @for (v of row; track $index; let x = $index) {
          <rect
            [attr.x]="x"
            [attr.y]="y"
            width="0.92"
            height="0.92"
            [attr.fill-opacity]="0.15 + (v / max()) * 0.85"
          />
        }
      }
    </svg>
    <div class="axis"><span>00h</span><span>12h</span><span>23h</span></div>
  `,
  styles: `
    svg {
      width: 100%;
      height: 6rem;
    }
    rect {
      fill: var(--accent);
    }
    .axis {
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: var(--muted);
    }
  `,
})
export class HeatmapWidgetComponent {
  readonly widget = input.required<HeatmapWidget>();
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');
  readonly timescale = input<Timescale>('24h');

  protected readonly rows = computed(() =>
    this.widget().data.days.slice(-TIMESCALE_HOURS[this.timescale()] / 24),
  );
  protected readonly max = computed(() => Math.max(...this.rows().flat(), 1));
}
