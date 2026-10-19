import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import type { StatsWidget, Density } from '../widget.model';

/** Inputs: widget, editMode, density, loading, locale. */
@Component({
  selector: 'app-stats-card-widget',
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
    <header>{{ widget().title }}</header>
    <div class="stats-value">
      {{ widget().data.value | number: '1.0-1' }} <small>{{ widget().data.unit }}</small>
    </div>
    <div class="stats-delta" [class.down]="widget().data.delta < 0">
      {{ widget().data.delta > 0 ? '▲' : '▼' }} {{ widget().data.delta | number: '1.0-1' }} %
    </div>
  `,
  styles: `
    .stats-value {
      font-size: 2rem;
      font-weight: 600;
    }
    .stats-value small {
      font-size: 1rem;
      color: var(--muted);
    }
    .stats-delta {
      color: var(--good);
    }
    .stats-delta.down {
      color: var(--bad);
    }
  `,
})
export class StatsCardWidgetComponent {
  readonly widget = input.required<StatsWidget>();
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');
}
