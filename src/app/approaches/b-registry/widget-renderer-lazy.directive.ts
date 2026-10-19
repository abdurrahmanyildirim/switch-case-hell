import type { Binding, Type } from '@angular/core';
import {
  Directive,
  ViewContainerRef,
  computed,
  effect,
  inject,
  input,
  inputBinding,
  output,
  outputBinding,
} from '@angular/core';
import { WIDGET_LOADERS } from '../../registry/widget-loaders';
import { declaredInputNames, declaredOutputNames } from '../../registry/widget-reflection';
import type { Timescale, Widget, WidgetEvent, Density } from '../../widgets/widget.model';

/**
 * Approach B · Pattern 2 over a lazy registry: same binding logic as `WidgetRendererDirective`,
 * but each widget component is fetched with `import()` the first time its type appears.
 */
@Directive({
  selector: '[appLazyWidgetRenderer]',
  exportAs: 'appLazyWidgetRenderer',
})
export class LazyWidgetRendererDirective {
  readonly widget = input.required<Widget | undefined>({ alias: 'appLazyWidgetRenderer' });
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');
  readonly timescale = input<Timescale>('24h');
  readonly widgetEvent = output<WidgetEvent>();

  readonly hasComponent = computed(() => !!this.loader());

  private readonly viewContainer = inject(ViewContainerRef);

  private readonly loader = computed((): (() => Promise<Type<unknown>>) | undefined => {
    const type = this.widget()?.type;
    return type ? WIDGET_LOADERS[type] : undefined;
  });

  constructor() {
    effect(async (onCleanup) => {
      const loader = this.loader();
      let stale = false;
      onCleanup(() => (stale = true));

      this.viewContainer.clear();
      if (!loader) return;

      const componentType = await loader();
      if (stale) return; // type changed while the chunk was loading

      const candidates: Record<string, () => unknown> = {
        widget: this.widget,
        editMode: this.editMode,
        density: this.density,
        loading: this.loading,
        locale: this.locale,
        timescale: this.timescale,
      };
      const declaredInputs = declaredInputNames(componentType);
      const bindings: Binding[] = Object.entries(candidates)
        .filter(([name]) => declaredInputs.has(name))
        .map(([name, getter]) => inputBinding(name, getter));
      if (declaredOutputNames(componentType).has('widgetEvent')) {
        bindings.push(outputBinding<WidgetEvent>('widgetEvent', (e) => this.widgetEvent.emit(e)));
      }

      this.viewContainer.createComponent(componentType, { bindings });
    });
  }
}
