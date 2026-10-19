import {
  CANDIDATE_INPUTS,
  CANDIDATE_OUTPUTS,
} from '../approaches/b-registry/widget-renderer.directive';
import { declaredInputNames, declaredOutputNames } from './widget-reflection';
import { WIDGET_REGISTRY } from './widget-registry';

/**
 * Pattern 2 coverage guard.
 *
 * The flexible renderer silently skips inputs/outputs it doesn't know about. That is the point —
 * but it also means a widget that declares `timeScale` instead of `timescale` compiles fine and
 * just never updates. This spec turns that silent drop into a failing test.
 */
describe('WIDGET_REGISTRY ↔ renderer coverage', () => {
  const candidateInputs = new Set<string>(CANDIDATE_INPUTS);
  const candidateOutputs = new Set<string>(CANDIDATE_OUTPUTS);

  it.each(Object.entries(WIDGET_REGISTRY))(
    '%s: every declared input/output is supplied',
    (_, component) => {
      expect([...declaredInputNames(component)].filter((n) => !candidateInputs.has(n))).toEqual([]);
      expect([...declaredOutputNames(component)].filter((n) => !candidateOutputs.has(n))).toEqual(
        [],
      );
    },
  );

  it.each(Object.entries(WIDGET_REGISTRY))(
    '%s: declares the required `widget` input',
    (_, component) => {
      expect(declaredInputNames(component).has('widget')).toBe(true);
    },
  );
});
