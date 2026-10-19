import { reflectComponentType, type Type } from '@angular/core';
import { DashboardState } from '../../shared/dashboard-state';
import { createWidgetDefinitions } from './widget-definitions';

/**
 * The compiler checks the map against each component's *property* names. Angular binds by *public*
 * name, which differs for aliased inputs (`input({ alias })`), and the types can't see legacy
 * `@Input()` decorators at all. This spec closes that gap at runtime.
 */
describe('createWidgetDefinitions ↔ components', () => {
  const definitions = createWidgetDefinitions(new DashboardState());

  it.each(Object.entries(definitions))(
    '%s binds exactly the declared inputs and outputs',
    (_, def) => {
      const mirror = reflectComponentType(def.component as Type<unknown>)!;
      expect(Object.keys(def.inputs).sort()).toEqual(
        mirror.inputs.map((i) => i.templateName).sort(),
      );
      expect(Object.keys(def.outputs).sort()).toEqual(
        mirror.outputs.map((o) => o.templateName).sort(),
      );
    },
  );
});
