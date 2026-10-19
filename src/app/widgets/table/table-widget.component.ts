import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { TableWidget, WidgetEvent, Density } from '../widget.model';

/** Inputs: widget, editMode, density, loading, locale. Outputs: widgetEvent. */
@Component({
  selector: 'app-table-widget',
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
    <table>
      <thead>
        <tr>
          @for (col of widget().data.columns; track col) {
            <th>{{ col }}</th>
          }
        </tr>
      </thead>
      <tbody>
        @for (row of widget().data.rows; track $index) {
          <tr (click)="select(row)">
            @for (cell of row; track $index) {
              <td>{{ cell }}</td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: `
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
    }
    th,
    td {
      text-align: left;
      padding: 0.25rem 0.4rem;
      border-bottom: 1px solid var(--line);
    }
    tbody tr {
      cursor: pointer;
    }
    tbody tr:hover {
      background: var(--hover);
    }
  `,
})
export class TableWidgetComponent {
  readonly widget = input.required<TableWidget>();
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');
  readonly widgetEvent = output<WidgetEvent>();

  protected select(row: readonly (string | number)[]): void {
    this.widgetEvent.emit({
      widgetId: this.widget().id,
      kind: 'row-select',
      label: String(row[0]),
    });
  }
}
