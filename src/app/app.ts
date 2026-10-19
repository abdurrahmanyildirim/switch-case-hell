import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly approaches = [
    { path: 'a-switch', label: 'A · @switch' },
    { path: 'b-strict', label: 'B · strict' },
    { path: 'b-flexible', label: 'B · flexible' },
    { path: 'b-lazy', label: 'B · lazy' },
    { path: 'c-outlet', label: 'C · ngComponentOutlet' },
    { path: 'd-typed-map', label: 'D · typed map' },
  ];
}
