import type { Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { SAMPLE_WIDGET_COUNT } from '../data/sample-dashboard';
import { DashboardState } from '../shared/dashboard-state';
import { SwitchDashboardComponent } from './a-switch/switch-dashboard.component';
import { LazyRegistryDashboardComponent } from './b-registry/lazy-registry-dashboard.component';
import { RegistryDashboardComponent } from './b-registry/registry-dashboard.component';
import { StrictRegistryDashboardComponent } from './b-registry/strict-registry-dashboard.component';
import { OutletDashboardComponent } from './c-outlet/outlet-dashboard.component';
import { TypedMapDashboardComponent } from './d-typed-map/typed-map-dashboard.component';

interface Case {
  name: string;
  component: Type<unknown>;
  /** Whether timescale and widget events reach the widgets (false = strict contract). */
  wiresExtras: boolean;
}

const CASES: Case[] = [
  { name: 'A · @switch', component: SwitchDashboardComponent, wiresExtras: true },
  { name: 'B · strict', component: StrictRegistryDashboardComponent, wiresExtras: false },
  { name: 'B · flexible', component: RegistryDashboardComponent, wiresExtras: true },
  { name: 'B · lazy', component: LazyRegistryDashboardComponent, wiresExtras: true },
  { name: 'C · ngComponentOutlet', component: OutletDashboardComponent, wiresExtras: true },
  { name: 'D · typed map', component: TypedMapDashboardComponent, wiresExtras: true },
];

/** Settles change detection, including lazy widget chunks that resolve over several ticks. */
async function settle(fixture: ComponentFixture<unknown>): Promise<void> {
  for (let i = 0; i < 10; i++) {
    await fixture.whenStable();
    await new Promise((r) => setTimeout(r));
  }
}

describe.each(CASES)('$name', ({ component, wiresExtras }) => {
  let fixture: ComponentFixture<unknown>;
  let el: HTMLElement;
  let state: DashboardState;
  let consoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    // Dev-mode binding problems (e.g. NG0303 unknown input) are logged, not thrown.
    consoleError = vi.spyOn(console, 'error');
    fixture = TestBed.createComponent(component);
    el = fixture.nativeElement;
    state = fixture.debugElement.injector.get(DashboardState);
    await settle(fixture);
  });

  afterEach(() => {
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('renders every known widget plus a fallback card for the unknown type', () => {
    expect(el.querySelectorAll('.widget:not(.unsupported)').length).toBe(SAMPLE_WIDGET_COUNT);
    const fallback = el.querySelectorAll('.widget.unsupported');
    expect(fallback.length).toBe(1);
    expect(fallback[0].textContent).toContain('HEATMAP_3D');
  });

  it('updates inputs in place without recreating widgets', async () => {
    const before = el.querySelector('app-chart-widget');
    expect(before?.classList.contains('editing')).toBe(false);

    state.editMode.set(true);
    await settle(fixture);

    const after = el.querySelector('app-chart-widget');
    expect(after).toBe(before);
    expect(after?.classList.contains('editing')).toBe(true);
  });

  it(
    wiresExtras ? 'forwards timescale' : 'does not wire timescale (not in the contract)',
    async () => {
      state.timescale.set('7d');
      await settle(fixture);
      const tag = el.querySelector('app-chart-widget .tag')?.textContent?.trim();
      expect(tag).toBe(wiresExtras ? '7d' : '24h');
    },
  );

  it(
    wiresExtras ? 'forwards widget events' : 'does not wire widget events (not in the contract)',
    async () => {
      el.querySelector<HTMLElement>('app-table-widget tbody tr')?.click();
      await settle(fixture);
      expect(state.events().length).toBe(wiresExtras ? 1 : 0);
    },
  );
});
