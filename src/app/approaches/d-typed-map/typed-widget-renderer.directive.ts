import type { Binding, Type } from '@angular/core';
import {
  Directive,
  ViewContainerRef,
  afterRenderEffect,
  computed,
  inject,
  input,
  inputBinding,
  outputBinding,
} from '@angular/core';
import type { Widget } from '../../widgets/widget.model';
import type { WidgetDefinitionMap } from './widget-definition';

/** An entry with its per-type generics erased — the only place the correlation is cast away. */
interface ErasedDefinition {
  readonly component: Type<unknown>;
  readonly inputs: Record<string, (widget: Widget) => unknown>;
  readonly outputs: Record<string, (event: unknown) => void>;
}

/**
 * Approach D: renders a widget from a fully typed definition map. No reflection and no candidate
 * list — the map already says exactly which inputs and outputs each component gets.
 */
@Directive({
  selector: '[appTypedWidgetRenderer]',
  exportAs: 'appTypedWidgetRenderer',
})
export class TypedWidgetRendererDirective {
  readonly widget = input.required<Widget | undefined>({ alias: 'appTypedWidgetRenderer' });
  readonly definitions = input.required<WidgetDefinitionMap>();

  readonly hasComponent = computed(() => !!this.definition());

  private readonly viewContainer = inject(ViewContainerRef);

  // Depends only on the widget's type, so input changes never recreate the component.
  private readonly definition = computed((): ErasedDefinition | undefined => {
    const type = this.widget()?.type;
    // TypeScript can't correlate `definitions[type]` with `widget` across the union, but the entry
    // was chosen by `widget.type`, so its getters receive exactly the config they were typed for.
    return type ? (this.definitions()[type] as ErasedDefinition | undefined) : undefined;
  });

  private currentDefinition: ErasedDefinition | undefined;

  constructor() {
    afterRenderEffect(() => {
      const definition = this.definition();
      if (definition === this.currentDefinition) return;
      this.currentDefinition = definition;

      this.viewContainer.clear();
      if (!definition) return;

      const bindings: Binding[] = [
        ...Object.entries(definition.inputs).map(([name, get]) =>
          inputBinding(name, () => get(this.widget()!)),
        ),
        ...Object.entries(definition.outputs).map(([name, handle]) => outputBinding(name, handle)),
      ];
      this.viewContainer.createComponent(definition.component, { bindings });
    });
  }
}
