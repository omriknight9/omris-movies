import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-watch-providers',
  templateUrl: './watch-providers.component.html',
  styleUrls: ['./watch-providers.component.scss']
})

export class WatchProvidersComponent {
  currentEnvironment = environment;
  constructor() { }
}
