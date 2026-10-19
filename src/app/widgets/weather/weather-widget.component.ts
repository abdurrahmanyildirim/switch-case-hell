import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { WeatherWidget, Density } from '../widget.model';

/** Inputs: widget, editMode, density, loading, locale. */
@Component({
  selector: 'app-weather-widget',
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
    <div class="now">
      <span class="temp">{{ widget().data.temperatureC }}°C</span>
      <span class="hum">{{ widget().data.humidity }}% rH</span>
    </div>
    <ol>
      @for (f of widget().data.forecast; track f.hour) {
        <li>
          <span>+{{ f.hour }}h</span><strong>{{ f.tempC }}°</strong>
        </li>
      }
    </ol>
  `,
  styles: `
    .now {
      display: flex;
      align-items: baseline;
      gap: 0.6rem;
    }
    .temp {
      font-size: 1.8rem;
      font-weight: 600;
    }
    .hum {
      color: var(--muted);
    }
    ol {
      list-style: none;
      margin: 0.5rem 0 0;
      padding: 0;
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
    }
    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: var(--muted);
    }
    li strong {
      color: var(--fg);
    }
  `,
})
export class WeatherWidgetComponent {
  readonly widget = input.required<WeatherWidget>();
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');
}
