import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { AssetStatus, StatusGridWidget, WidgetEvent, Density } from '../widget.model';

/** Inputs: widget, editMode, density, loading, locale. Outputs: widgetEvent. */
@Component({
  selector: 'app-status-grid-widget',
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
    <div class="grid">
      @for (asset of widget().data.assets; track asset.name) {
        <button type="button" [class]="asset.state" [title]="asset.state" (click)="select(asset)">
          {{ asset.name }}
        </button>
      }
    </div>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.3rem;
    }
    button {
      font: inherit;
      font-size: 0.72rem;
      padding: 0.35rem 0.1rem;
      border-radius: 4px;
      border: 1px solid var(--line);
      background: var(--hover);
      color: var(--fg);
      cursor: pointer;
    }
    button.ok {
      border-color: var(--good);
    }
    button.warn {
      border-color: var(--warn);
    }
    button.fault {
      border-color: var(--bad);
      background: color-mix(in srgb, var(--bad) 15%, transparent);
    }
    button.off {
      opacity: 0.5;
    }
  `,
})
export class StatusGridWidgetComponent {
  readonly widget = input.required<StatusGridWidget>();
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');
  readonly widgetEvent = output<WidgetEvent>();

  protected select(asset: AssetStatus): void {
    this.widgetEvent.emit({
      widgetId: this.widget().id,
      kind: 'asset-select',
      label: `${asset.name} (${asset.state})`,
    });
  }
}
