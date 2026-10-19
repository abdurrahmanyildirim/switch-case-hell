import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { ScatterWidget, Density } from '../widget.model';

/** Inputs: widget, editMode, density, loading, locale. */
@Component({
  selector: 'app-scatter-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'widget',
    '[class.editing]': 'editMode()',
    '[class.compact]': 'density() === "compact"',
    '[class.loading]': 'loading()',
    '[attr.lang]': 'locale()',
  },
  template: `
    <header>{{ widget().title }}</header>
    <svg viewBox="0 0 100 50" role="img" [attr.aria-label]="widget().title">
      <line x1="2" y1="48" x2="100" y2="48" class="axis" />
      <line x1="2" y1="0" x2="2" y2="48" class="axis" />
      @for (p of scaled(); track $index) {
        <circle [attr.cx]="p[0]" [attr.cy]="p[1]" r="1.4" />
      }
    </svg>
    <div class="labels">
      <span>x: {{ widget().data.xLabel }}</span
      ><span>y: {{ widget().data.yLabel }}</span>
    </div>
  `,
  styles: `
    svg {
      width: 100%;
      height: 6rem;
    }
    circle {
      fill: var(--accent);
      fill-opacity: 0.7;
    }
    .axis {
      stroke: var(--line);
      stroke-width: 0.5;
    }
    .labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: var(--muted);
    }
  `,
})
export class ScatterWidgetComponent {
  readonly widget = input.required<ScatterWidget>();
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');

  protected readonly scaled = computed(() => {
    const pts = this.widget().data.points;
    const maxX = Math.max(...pts.map((p) => p[0]), 1);
    const maxY = Math.max(...pts.map((p) => p[1]), 1);
    return pts.map(([x, y]) => [4 + (x / maxX) * 94, 46 - (y / maxY) * 44] as const);
  });
}
