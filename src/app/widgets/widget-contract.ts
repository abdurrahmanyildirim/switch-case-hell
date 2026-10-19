import type { Signal } from '@angular/core';
import type { Density, Widget } from './widget.model';

/**
 * Pattern 1 (strict): the identical input set every widget must declare.
 *
 * Whatever is listed here is bound on *every* widget, so it can only contain inputs that all
 * widgets accept. Wiring `timescale` or `widgetEvent` through the strict renderer means adding
 * them here — and then to every widget, including the ones that ignore them.
 */
export interface WidgetComponentContract<W extends Widget = Widget> {
  readonly widget: Signal<W>;
  readonly editMode: Signal<boolean>;
  readonly density: Signal<Density>;
  readonly loading: Signal<boolean>;
  readonly locale: Signal<string>;
}
