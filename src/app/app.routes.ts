import { Routes } from '@angular/router';

/** Each approach is a lazy route, so the build emits one chunk per approach to compare. */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'b-flexible' },
  {
    path: 'a-switch',
    title: 'A · @switch',
    loadComponent: () =>
      import('./approaches/a-switch/switch-dashboard.component').then(
        (m) => m.SwitchDashboardComponent,
      ),
  },
  {
    path: 'b-strict',
    title: 'B · strict',
    loadComponent: () =>
      import('./approaches/b-registry/strict-registry-dashboard.component').then(
        (m) => m.StrictRegistryDashboardComponent,
      ),
  },
  {
    path: 'b-flexible',
    title: 'B · flexible',
    loadComponent: () =>
      import('./approaches/b-registry/registry-dashboard.component').then(
        (m) => m.RegistryDashboardComponent,
      ),
  },
  {
    path: 'b-lazy',
    title: 'B · lazy',
    loadComponent: () =>
      import('./approaches/b-registry/lazy-registry-dashboard.component').then(
        (m) => m.LazyRegistryDashboardComponent,
      ),
  },
  {
    path: 'c-outlet',
    title: 'C · ngComponentOutlet',
    loadComponent: () =>
      import('./approaches/c-outlet/outlet-dashboard.component').then(
        (m) => m.OutletDashboardComponent,
      ),
  },
  {
    path: 'd-typed-map',
    title: 'D · typed map',
    loadComponent: () =>
      import('./approaches/d-typed-map/typed-map-dashboard.component').then(
        (m) => m.TypedMapDashboardComponent,
      ),
  },
];
