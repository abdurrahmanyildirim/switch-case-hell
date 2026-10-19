import type { InputSignalWithTransform, OutputRef, Type } from '@angular/core';
import type { WidgetOf, WidgetType } from '../../widgets/widget.model';

/** Public signal-input property names of component `C` (protected/private members are invisible). */
type InputKeys<C> = {
  [K in keyof C]-?: C[K] extends InputSignalWithTransform<any, any> ? K : never;
}[keyof C];

/** Public `output()` property names of component `C`. */
type OutputKeys<C> = { [K in keyof C]-?: C[K] extends OutputRef<any> ? K : never }[keyof C];

/**
 * One getter per input the component declares — no more, no less. Each getter receives the widget
 * config (already narrowed to this widget type) and must return exactly what the input accepts.
 */
export type InputGetters<C, W> = {
  [K in InputKeys<C>]: C[K] extends InputSignalWithTransform<any, infer V>
    ? (widget: W) => V
    : never;
};

/** One handler per output the component declares, typed with the output's event type. */
export type OutputHandlers<C> = {
  [K in OutputKeys<C>]: C[K] extends OutputRef<infer E> ? (event: E) => void : never;
};

/** How to render one widget type: which component, and how to fill every input and output. */
export interface WidgetDefinition<T extends WidgetType, C> {
  readonly component: Type<C>;
  readonly inputs: NoInfer<InputGetters<C, WidgetOf<T>>>;
  readonly outputs: NoInfer<OutputHandlers<C>>;
}

/** The full map: every widget type must be present, each with its own component type. */
export type WidgetDefinitionMap<M extends Record<WidgetType, unknown> = Record<WidgetType, any>> = {
  readonly [T in WidgetType]: WidgetDefinition<T, M[T]>;
};

/**
 * Identity function that exists only for type inference. The parameter is a mapped type over
 * `keyof M`, so TypeScript infers `M` key by key from each entry's `component`; `inputs`/`outputs`
 * are then checked against that component (`NoInfer` stops them from influencing the inference).
 * The return type re-asserts that every `WidgetType` is present.
 */
export function defineWidgets<M extends Record<WidgetType, unknown>>(definitions: {
  readonly [T in keyof M & WidgetType]: WidgetDefinition<T, M[T]>;
}): WidgetDefinitionMap<M> {
  return definitions;
}
