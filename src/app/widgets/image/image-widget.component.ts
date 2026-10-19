import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ImageWidget, Density } from '../widget.model';

/** Inputs: widget, editMode, density, loading, locale. */
@Component({
  selector: 'app-image-widget',
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
    <figure>
      <img [src]="widget().data.src" [alt]="widget().data.caption" />
      <figcaption>{{ widget().data.caption }}</figcaption>
    </figure>
  `,
  styles: `
    figure {
      margin: 0;
    }
    img {
      width: 100%;
      height: 5.5rem;
      object-fit: cover;
      border-radius: 4px;
      background: var(--hover);
    }
    figcaption {
      font-size: 0.75rem;
      color: var(--muted);
      margin-top: 0.25rem;
    }
  `,
})
export class ImageWidgetComponent {
  readonly widget = input.required<ImageWidget>();
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');
}
