import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { CategoryBarWidget, Density } from '../widget.model';

/** Inputs: widget, editMode, density, loading, locale. */
@Component({
  selector: 'app-category-bar-widget',
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
    @for (item of widget().data.items; track item.label) {
      <div class="row">
        <span class="label">{{ item.label }}</span>
        <span class="bar"><span [style.width.%]="(item.value / max()) * 100"></span></span>
        <span class="value">{{ item.value }} {{ widget().data.unit }}</span>
      </div>
    }
  `,
  styles: `
    .row {
      display: grid;
      grid-template-columns: 5.5rem 1fr 4.5rem;
      gap: 0.4rem;
      align-items: center;
      font-size: 0.8rem;
      margin: 0.2rem 0;
    }
    .bar {
      background: var(--hover);
      border-radius: 3px;
      height: 0.6rem;
      overflow: hidden;
    }
    .bar span {
      display: block;
      height: 100%;
      background: var(--accent);
    }
    .value {
      text-align: right;
      color: var(--muted);
    }
  `,
})
export class CategoryBarWidgetComponent {
  readonly widget = input.required<CategoryBarWidget>();
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');

  protected readonly max = computed(() =>
    Math.max(...this.widget().data.items.map((i) => i.value), 1),
  );
}
