import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { TextWidget, Density } from '../widget.model';

/** Inputs: widget, editMode, density, loading, locale. */
@Component({
  selector: 'app-text-widget',
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
    @for (p of widget().data.paragraphs; track $index) {
      <p>{{ p }}</p>
    }
    @if (editMode()) {
      <p class="hint">Double-click to edit text</p>
    }
  `,
  styles: `
    p {
      margin: 0 0 0.5rem;
      font-size: 0.85rem;
      line-height: 1.4;
    }
    .hint {
      color: var(--muted);
      font-style: italic;
    }
  `,
})
export class TextWidgetComponent {
  readonly widget = input.required<TextWidget>();
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');
}
