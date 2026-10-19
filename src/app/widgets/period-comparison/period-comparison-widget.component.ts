import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {
  lastHours,
  type PeriodComparisonWidget,
  type Timescale,
  type Density,
} from '../widget.model';

/** Inputs: widget, editMode, density, loading, locale, timescale. */
@Component({
  selector: 'app-period-comparison-widget',
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
    <div class="cols">
      <div>
        <small>This period</small><strong>{{ current() | number: '1.0-0' }}</strong>
      </div>
      <div>
        <small>Previous</small><strong>{{ previous() | number: '1.0-0' }}</strong>
      </div>
    </div>
    <div class="delta" [class.up]="change() > 0">
      {{ change() > 0 ? '▲' : '▼' }} {{ change() | number: '1.0-1' }} % · {{ widget().data.unit }}
    </div>
  `,
  styles: `
    .cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
    }
    .cols div {
      display: flex;
      flex-direction: column;
    }
    small {
      color: var(--muted);
      font-size: 0.75rem;
    }
    strong {
      font-size: 1.4rem;
    }
    .delta {
      margin-top: 0.5rem;
      color: var(--good);
    }
    .delta.up {
      color: var(--bad);
    }
  `,
})
export class PeriodComparisonWidgetComponent {
  readonly widget = input.required<PeriodComparisonWidget>();
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');
  readonly timescale = input<Timescale>('24h');

  private readonly sum = (values: readonly number[]) => values.reduce((a, b) => a + b, 0);
  protected readonly current = computed(() =>
    this.sum(lastHours(this.widget().data.current, this.timescale())),
  );
  protected readonly previous = computed(() =>
    this.sum(lastHours(this.widget().data.previous, this.timescale())),
  );
  /** Energy consumption: an increase is bad (red). */
  protected readonly change = computed(
    () => ((this.current() - this.previous()) / (this.previous() || 1)) * 100,
  );
}
