import type { Type } from '@angular/core';
import {
  Directive,
  ViewContainerRef,
  afterRenderEffect,
  computed,
  inject,
  input,
  inputBinding,
} from '@angular/core';
import { STRICT_WIDGET_REGISTRY } from '../../registry/widget-registry';
import type { WidgetComponentContract } from '../../widgets/widget-contract';
import type { Widget, Density } from '../../widgets/widget.model';

/**
 * Approach B · Pattern 1 (strict).
 *
 * Every registered component implements `WidgetComponentContract`, so the renderer binds the
 * contract's inputs unconditionally — no reflection. The price: it can only bind what *every*
 * widget accepts. `timescale` and `widgetEvent` are not part of the contract, so they are not
 * wired here (see GUIDE.md § Binding patterns for the "grow the contract" alternative).
 */
@Directive({
  selector: '[appStrictWidgetRenderer]',
  exportAs: 'appStrictWidgetRenderer',
})
export class StrictWidgetRendererDirective {
  readonly widget = input.required<Widget | undefined>({ alias: 'appStrictWidgetRenderer' });
  readonly editMode = input(false);
  readonly density = input<Density>('comfortable');
  readonly loading = input(false);
  readonly locale = input('en');

  readonly hasComponent = computed(() => !!this.componentType());

  private readonly viewContainer = inject(ViewContainerRef);

  private readonly componentType = computed((): Type<WidgetComponentContract> | undefined => {
    const type = this.widget()?.type;
    return type ? STRICT_WIDGET_REGISTRY[type] : undefined;
  });

  private currentType: Type<WidgetComponentContract> | undefined;

  constructor() {
    afterRenderEffect(() => {
      const componentType = this.componentType();
      if (componentType === this.currentType) return;
      this.currentType = componentType;

      this.viewContainer.clear();
      if (!componentType) return;

      // `satisfies Record<keyof WidgetComponentContract, …>` keeps this list in lock-step with the
      // contract: adding a contract member without binding it here is a compile error.
      const contractInputs = {
        widget: this.widget,
        editMode: this.editMode,
        density: this.density,
        loading: this.loading,
        locale: this.locale,
      } satisfies Record<keyof WidgetComponentContract, () => unknown>;

      this.viewContainer.createComponent(componentType, {
        bindings: Object.entries(contractInputs).map(([name, getter]) =>
          inputBinding(name, getter),
        ),
      });
    });
  }
}
