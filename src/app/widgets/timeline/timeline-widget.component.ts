import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import {
  TIMESCALE_HOURS,
  type Timescale,
  type TimelineEntry,
  type TimelineWidget,
  type WidgetEvent,
  type Density,
} from '../widget.model';

/** Inputs: widget, editMode, density, loading, locale, timescale. Outputs: widgetEvent. */
@Component({
  selector: 'app-timeline-widget',
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
    <ol>
      @for (entry of visible(); track $index) {
        <li [class]="entry.severity" (click)="select(entry)">
          <time>{{ entry.hoursAgo }}h ago</time> {{ entry.label }}
        </li>
      } @empty {
        <li class="empty">No events in this window</li>
      }
    </ol>
  `,
  styles: `
    ol {
      list-style: none;
      margin: 0;
      padding: 0;
      font-size: 0.85rem;
    }
    li {
      padding: 0.25rem 0 0.25rem 0.6rem;
      border-left: 3px solid var(--line);
      cursor: pointer;
    }
    li:hover {
      background: var(--hover);
    }
    li.warn {
      border-color: var(--warn);
    }
    li.alarm {
      border-color: var(--bad);
    }
    li.empty {
      cursor: default;
      color: var(--muted);
    }
    time {
      color: var(--muted);
      margin-right: 0.4rem;
    }
  `,
})
export class TimelineWidgetComponent {
  readonly widget = input.required<TimelineWidget>();
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');
  readonly timescale = input<Timescale>('24h');
  readonly widgetEvent = output<WidgetEvent>();

  protected readonly visible = computed(() =>
    this.widget().data.entries.filter((e) => e.hoursAgo <= TIMESCALE_HOURS[this.timescale()]),
  );

  protected select(entry: TimelineEntry): void {
    this.widgetEvent.emit({ widgetId: this.widget().id, kind: 'entry-select', label: entry.label });
  }
}
