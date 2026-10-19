import { NgComponentOutlet } from '@angular/common';
import {
  DestroyRef,
  Directive,
  afterEveryRender,
  inject,
  output,
  type OutputRefSubscription,
} from '@angular/core';
import { declaredOutputNames } from '../../registry/widget-reflection';
import type { WidgetEvent } from '../../widgets/widget.model';

/**
 * WORKAROUND — `NgComponentOutlet` has no way to bind outputs (no `bindings`, no outputs input).
 *
 * This sits next to `*ngComponentOutlet`, watches for the component instance it created and
 * subscribes to `widgetEvent` by hand. It has to poll after every render because the outlet
 * exposes `componentInstance` as a plain getter, not a signal or event.
 */
@Directive({ selector: '[ngComponentOutlet][appOutletOutputs]' })
export class OutletOutputsDirective {
  readonly widgetEvent = output<WidgetEvent>({ alias: 'appOutletOutputs' });

  private readonly outlet = inject(NgComponentOutlet);
  private instance: unknown = null;
  private subscription: OutputRefSubscription | undefined;

  constructor() {
    afterEveryRender(() => {
      const instance = this.outlet.componentInstance;
      if (instance === this.instance) return;
      this.instance = instance;
      this.subscription?.unsubscribe();
      this.subscription = undefined;

      const type = this.outlet.ngComponentOutlet;
      if (!instance || !type || !declaredOutputNames(type).has('widgetEvent')) return;
      const ref = (
        instance as {
          widgetEvent: { subscribe: (fn: (e: WidgetEvent) => void) => OutputRefSubscription };
        }
      ).widgetEvent;
      this.subscription = ref.subscribe((e) => this.widgetEvent.emit(e));
    });
    inject(DestroyRef).onDestroy(() => this.subscription?.unsubscribe());
  }
}
