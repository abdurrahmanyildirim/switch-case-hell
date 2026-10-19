import type { Binding, Type } from '@angular/core';
import {
  Directive,
  ViewContainerRef,
  afterRenderEffect,
  computed,
  inject,
  input,
  inputBinding,
  output,
  outputBinding,
} from '@angular/core';
import { declaredInputNames, declaredOutputNames } from '../../registry/widget-reflection';
import { WIDGET_REGISTRY } from '../../registry/widget-registry';
import type { Timescale, Widget, WidgetEvent, Density } from '../../widgets/widget.model';

/** Every input the renderer can supply. Exported for the registry coverage spec. */
export const CANDIDATE_INPUTS = [
  'widget',
  'editMode',
  'density',
  'loading',
  'locale',
  'timescale',
] as const;
/** Every output the renderer can forward. Exported for the registry coverage spec. */
export const CANDIDATE_OUTPUTS = ['widgetEvent'] as const;

/**
 * Approach B · Pattern 2 (flexible) — reflection-based flexible renderer.
 *
 * Renders a dashboard widget by dynamically instantiating the component registered for the
 * widget's type, binding only the inputs/outputs that component actually declares.
 */
@Directive({
  selector: '[appWidgetRenderer]',
  exportAs: 'appWidgetRenderer',
})
export class WidgetRendererDirective {
  readonly widget = input.required<Widget | undefined>({ alias: 'appWidgetRenderer' });
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');
  readonly timescale = input<Timescale>('24h');
  readonly widgetEvent = output<WidgetEvent>();

  /** True once a matching component type is resolved — drives the caller's fallback card. */
  readonly hasComponent = computed(() => !!this.componentType());

  private readonly viewContainer = inject(ViewContainerRef);

  // Depends only on the widget's type, so unrelated widget/input changes never recreate it.
  private readonly componentType = computed((): Type<unknown> | undefined => {
    const type = this.widget()?.type;
    return type ? WIDGET_REGISTRY[type] : undefined;
  });

  private currentType: Type<unknown> | undefined;

  constructor() {
    afterRenderEffect(() => {
      const componentType = this.componentType();

      if (componentType === this.currentType) return; // same component, bindings are live
      this.currentType = componentType;

      this.viewContainer.clear();
      if (!componentType) {
        return;
      }

      // Signals themselves are valid `() => unknown` getters — pass them straight through.
      const candidates: Record<(typeof CANDIDATE_INPUTS)[number], () => unknown> = {
        widget: this.widget,
        editMode: this.editMode,
        density: this.density,
        loading: this.loading,
        locale: this.locale,
        timescale: this.timescale,
      };

      const declaredInputs = declaredInputNames(componentType);
      const declaredOutputs = declaredOutputNames(componentType);

      const bindings: Binding[] = Object.entries(candidates)
        .filter(([name]) => declaredInputs.has(name))
        .map(([name, getter]) => inputBinding(name, getter));

      if (declaredOutputs.has('widgetEvent')) {
        bindings.push(outputBinding<WidgetEvent>('widgetEvent', (e) => this.widgetEvent.emit(e)));
      }

      this.viewContainer.createComponent(componentType, { bindings });
    });
  }
}
