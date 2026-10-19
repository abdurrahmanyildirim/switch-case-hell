import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { GaugeWidget, Density } from '../widget.model';

/** Inputs: widget, editMode, density, loading, locale. */
@Component({
  selector: 'app-gauge-widget',
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
    <svg viewBox="0 0 100 56" role="img" [attr.aria-label]="widget().title">
      <path class="track" d="M 10 50 A 40 40 0 0 1 90 50" pathLength="100" />
      <path
        class="fill"
        d="M 10 50 A 40 40 0 0 1 90 50"
        pathLength="100"
        [attr.stroke-dasharray]="ratio() * 100 + ' 100'"
      />
      <text x="50" y="48" text-anchor="middle">
        {{ widget().data.value }}{{ widget().data.unit }}
      </text>
    </svg>
  `,
  styles: `
    svg {
      width: 100%;
      max-height: 7rem;
    }
    path {
      fill: none;
      stroke-width: 8;
      stroke-linecap: round;
    }
    .track {
      stroke: var(--line);
    }
    .fill {
      stroke: var(--accent);
    }
    text {
      font-size: 12px;
      fill: currentColor;
      font-weight: 600;
    }
  `,
})
export class GaugeWidgetComponent {
  readonly widget = input.required<GaugeWidget>();
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');

  protected readonly ratio = computed(() => {
    const { value, min, max } = this.widget().data;
    return Math.min(1, Math.max(0, (value - min) / (max - min)));
  });
}
