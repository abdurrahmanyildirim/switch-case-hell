import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Fallback card for widget types this build has no component for. */
@Component({
  selector: 'app-unsupported-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'widget unsupported' },
  template: `
    <header>Unsupported widget</header>
    <p>
      Type <code>{{ type() }}</code> isn't available in this version.
    </p>
  `,
})
export class UnsupportedWidgetComponent {
  readonly type = input.required<string>();
}
