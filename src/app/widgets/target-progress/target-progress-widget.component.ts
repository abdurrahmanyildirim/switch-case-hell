import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import type { TargetProgressWidget, Density } from '../widget.model';

/** Inputs: widget, editMode, density, loading, locale. */
@Component({
  selector: 'app-target-progress-widget',
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
    <div class="figures">
      <span class="actual">{{ widget().data.actual | number: '1.0-0' }}</span>
      / {{ widget().data.target | number: '1.0-0' }} {{ widget().data.unit }}
    </div>
    <div class="track">
      <div
        class="fill"
        [class.over]="ratio() > 1"
        [style.width.%]="Math.min(ratio(), 1) * 100"
      ></div>
    </div>
    <div class="caption">
      {{ ratio() * 100 | number: '1.0-0' }}% of {{ widget().data.period }} target
    </div>
  `,
  styles: `
    .figures {
      color: var(--muted);
    }
    .actual {
      font-size: 1.6rem;
      font-weight: 600;
      color: var(--fg);
    }
    .track {
      height: 0.6rem;
      background: var(--hover);
      border-radius: 3px;
      overflow: hidden;
      margin: 0.5rem 0 0.3rem;
    }
    .fill {
      height: 100%;
      background: var(--good);
    }
    .fill.over {
      background: var(--bad);
    }
    .caption {
      font-size: 0.75rem;
      color: var(--muted);
    }
  `,
})
export class TargetProgressWidgetComponent {
  readonly widget = input.required<TargetProgressWidget>();
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');

  protected readonly Math = Math;
  protected readonly ratio = computed(() => this.widget().data.actual / this.widget().data.target);
}
