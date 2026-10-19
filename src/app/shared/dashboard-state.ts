import { Injectable, signal } from '@angular/core';
import { createSampleDashboard } from '../data/sample-dashboard';
import type { Density, Timescale, WidgetEvent } from '../widgets/widget.model';

/**
 * Per-dashboard state shared by the shell (toolbar, event log) and the approach being demoed.
 * Provided at each approach's component so routes don't share state.
 */
@Injectable()
export class DashboardState {
  readonly widgets = signal(createSampleDashboard());
  readonly editMode = signal(false);
  readonly density = signal<Density>('comfortable');
  readonly loading = signal(false);
  readonly locale = signal('en');
  readonly timescale = signal<Timescale>('24h');
  readonly events = signal<readonly WidgetEvent[]>([]);

  log(event: WidgetEvent): void {
    this.events.update((list) => [event, ...list].slice(0, 8));
  }
}
