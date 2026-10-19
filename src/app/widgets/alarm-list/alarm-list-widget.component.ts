import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { Alarm, AlarmListWidget, WidgetEvent, Density } from '../widget.model';

/** Inputs: widget, editMode, density, loading, locale. Outputs: widgetEvent. */
@Component({
  selector: 'app-alarm-list-widget',
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
      {{ widget().title }} <span class="tag">{{ widget().data.alarms.length }} open</span>
    </header>
    <ul>
      @for (alarm of widget().data.alarms; track $index) {
        <li [class]="alarm.priority" (click)="select(alarm)">
          <strong>{{ alarm.asset }}</strong> {{ alarm.message }}
          <time>{{ alarm.minutesAgo }} min</time>
        </li>
      }
    </ul>
  `,
  styles: `
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      font-size: 0.8rem;
    }
    li {
      padding: 0.3rem 0.4rem;
      border-left: 3px solid var(--line);
      margin-bottom: 0.2rem;
      cursor: pointer;
      display: flex;
      gap: 0.35rem;
    }
    li:hover {
      background: var(--hover);
    }
    li.high {
      border-color: var(--bad);
    }
    li.medium {
      border-color: var(--warn);
    }
    strong {
      white-space: nowrap;
    }
    time {
      margin-left: auto;
      color: var(--muted);
      white-space: nowrap;
    }
  `,
})
export class AlarmListWidgetComponent {
  readonly widget = input.required<AlarmListWidget>();
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');
  readonly widgetEvent = output<WidgetEvent>();

  protected select(alarm: Alarm): void {
    this.widgetEvent.emit({
      widgetId: this.widget().id,
      kind: 'alarm-select',
      label: `${alarm.asset}: ${alarm.message}`,
    });
  }
}
