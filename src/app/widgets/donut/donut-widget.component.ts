import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { DonutWidget, Density } from '../widget.model';

const SHADES = [1, 0.75, 0.5, 0.3, 0.15];

/** Inputs: widget, editMode, density, loading, locale. */
@Component({
  selector: 'app-donut-widget',
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
    <div class="body">
      <svg viewBox="0 0 42 42" role="img" [attr.aria-label]="widget().title">
        @for (s of segments(); track s.label) {
          <circle
            cx="21"
            cy="21"
            r="15.9"
            pathLength="100"
            [attr.stroke-dasharray]="s.pct + ' ' + (100 - s.pct)"
            [attr.stroke-dashoffset]="25 - s.offset"
            [attr.stroke-opacity]="s.shade"
          />
        }
      </svg>
      <ul>
        @for (s of segments(); track s.label) {
          <li><i [style.opacity]="s.shade"></i>{{ s.label }} · {{ s.pct.toFixed(0) }}%</li>
        }
      </ul>
    </div>
  `,
  styles: `
    .body {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
    svg {
      width: 6rem;
      flex: none;
    }
    circle {
      fill: none;
      stroke: var(--accent);
      stroke-width: 6;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      font-size: 0.8rem;
    }
    i {
      display: inline-block;
      width: 0.6rem;
      height: 0.6rem;
      background: var(--accent);
      margin-right: 0.35rem;
      border-radius: 2px;
    }
  `,
})
export class DonutWidgetComponent {
  readonly widget = input.required<DonutWidget>();
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');

  protected readonly segments = computed(() => {
    const slices = this.widget().data.slices;
    const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;
    let offset = 0;
    return slices.map((s, i) => {
      const pct = (s.value / total) * 100;
      const seg = { label: s.label, pct, offset, shade: SHADES[i % SHADES.length] };
      offset += pct;
      return seg;
    });
  });
}
