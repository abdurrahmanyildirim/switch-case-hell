import { ChangeDetectionStrategy, Component, input, linkedSignal, output } from '@angular/core';
import type { SetpointWidget, WidgetEvent, Density } from '../widget.model';

/** Inputs: widget, editMode, density, loading, locale. Outputs: widgetEvent. Adjustable only in edit mode. */
@Component({
  selector: 'app-setpoint-widget',
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
    <div class="control">
      <button
        type="button"
        [disabled]="!editMode() || loading() || value() <= widget().data.min"
        (click)="nudge(-1)"
        aria-label="Decrease"
      >
        −
      </button>
      <span class="value"
        >{{ value() }} <small>{{ widget().data.unit }}</small></span
      >
      <button
        type="button"
        [disabled]="!editMode() || loading() || value() >= widget().data.max"
        (click)="nudge(1)"
        aria-label="Increase"
      >
        +
      </button>
    </div>
    <div class="range">
      {{ widget().data.min }} – {{ widget().data.max }} {{ widget().data.unit }}
    </div>
  `,
  styles: `
    .control {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }
    .value {
      font-size: 1.8rem;
      font-weight: 600;
      min-width: 6rem;
      text-align: center;
    }
    .value small {
      font-size: 0.9rem;
      color: var(--muted);
    }
    button {
      font-size: 1.2rem;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      border: 1px solid var(--line);
      background: var(--hover);
      color: var(--fg);
      cursor: pointer;
    }
    button:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .range {
      text-align: center;
      font-size: 0.75rem;
      color: var(--muted);
      margin-top: 0.4rem;
    }
  `,
})
export class SetpointWidgetComponent {
  readonly widget = input.required<SetpointWidget>();
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');
  readonly widgetEvent = output<WidgetEvent>();

  /** Local value, reset whenever the widget config changes. */
  protected readonly value = linkedSignal(() => this.widget().data.value);

  protected nudge(direction: 1 | -1): void {
    const { step, min, max, unit } = this.widget().data;
    const next =
      Math.round(Math.min(max, Math.max(min, this.value() + direction * step)) * 10) / 10;
    this.value.set(next);
    this.widgetEvent.emit({
      widgetId: this.widget().id,
      kind: 'setpoint-change',
      label: `${next} ${unit}`,
    });
  }
}
