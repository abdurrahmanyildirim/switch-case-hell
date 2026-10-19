import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import type { Density, Timescale } from '../widgets/widget.model';
import { DashboardState } from './dashboard-state';

/** Toolbar + grid + event log. Identical for every approach; only the projected grid differs. */
@Component({
  selector: 'app-dashboard-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="intro">
      <h2>{{ heading() }}</h2>
      <p>{{ summary() }}</p>
    </section>

    <div class="toolbar">
      <label>
        <input
          type="checkbox"
          [checked]="state.editMode()"
          (change)="state.editMode.set(!state.editMode())"
        />
        Edit mode
      </label>
      <label>
        <input
          type="checkbox"
          [checked]="state.loading()"
          (change)="state.loading.set(!state.loading())"
        />
        Loading
      </label>
      <label>
        Density
        <select [value]="state.density()" (change)="setDensity($event)">
          @for (d of densities; track d) {
            <option [value]="d">{{ d }}</option>
          }
        </select>
      </label>
      <label>
        Locale
        <select [value]="state.locale()" (change)="state.locale.set($any($event.target).value)">
          @for (l of locales; track l) {
            <option [value]="l">{{ l }}</option>
          }
        </select>
      </label>
      <label>
        Timescale
        <select [value]="state.timescale()" (change)="setTimescale($event)">
          @for (t of timescales; track t) {
            <option [value]="t">{{ t }}</option>
          }
        </select>
      </label>
    </div>

    <div class="layout">
      <div class="grid"><ng-content /></div>
      <aside class="log" aria-label="Widget events">
        <h3>Event log</h3>
        @for (e of state.events(); track $index) {
          <div class="log-entry">
            <code>{{ e.widgetId }}</code> {{ e.kind }}: {{ e.label }}
          </div>
        } @empty {
          <p class="muted">
            Click a table row, timeline entry, alarm, asset tile, or change a setpoint in edit mode.
          </p>
        }
      </aside>
    </div>
  `,
  styles: `
    .intro h2 {
      margin: 0 0 0.25rem;
    }
    .intro p {
      margin: 0;
      color: var(--muted);
      max-width: 70ch;
    }
    .toolbar {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
      margin: 1rem 0;
      align-items: center;
    }
    .layout {
      display: grid;
      grid-template-columns: 1fr 16rem;
      gap: 1rem;
      align-items: start;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
      gap: 0.75rem;
    }
    .log {
      position: sticky;
      top: 1rem;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 0.75rem;
      font-size: 0.85rem;
    }
    .log h3 {
      margin: 0 0 0.5rem;
      font-size: 0.95rem;
    }
    .log-entry {
      padding: 0.2rem 0;
      border-bottom: 1px solid var(--line);
    }
    .muted {
      color: var(--muted);
      margin: 0;
    }
    @media (max-width: 800px) {
      .layout {
        grid-template-columns: 1fr;
      }
      .log {
        position: static;
      }
    }
  `,
})
export class DashboardShellComponent {
  readonly heading = input.required<string>();
  readonly summary = input.required<string>();

  protected readonly state = inject(DashboardState);
  protected readonly timescales: readonly Timescale[] = ['24h', '7d', '30d'];

  protected readonly densities: readonly Density[] = ['comfortable', 'compact'];
  protected readonly locales = ['en', 'de', 'tr'];

  protected setDensity(event: Event): void {
    this.state.density.set((event.target as HTMLSelectElement).value as Density);
  }

  protected setTimescale(event: Event): void {
    this.state.timescale.set((event.target as HTMLSelectElement).value as Timescale);
  }
}
