import { reflectComponentType, type Type } from '@angular/core';

// Cache by component type — reflection is a one-time cost per widget type, not per render.
const declaredInputsCache = new Map<Type<unknown>, ReadonlySet<string>>();
const declaredOutputsCache = new Map<Type<unknown>, ReadonlySet<string>>();

export function declaredInputNames(comp: Type<unknown>): ReadonlySet<string> {
  let names = declaredInputsCache.get(comp);
  if (!names) {
    const mirror = reflectComponentType(comp);
    names = new Set(mirror?.inputs.map((i) => i.templateName) ?? []);
    declaredInputsCache.set(comp, names);
  }
  return names;
}

export function declaredOutputNames(comp: Type<unknown>): ReadonlySet<string> {
  let names = declaredOutputsCache.get(comp);
  if (!names) {
    const mirror = reflectComponentType(comp);
    names = new Set(mirror?.outputs.map((o) => o.templateName) ?? []);
    declaredOutputsCache.set(comp, names);
  }
  return names;
}
