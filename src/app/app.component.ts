import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService, TranslateModule } from "@ngx-translate/core";

import { SideNavigationBarComponent } from './public/components/side-navigation-bar/side-navigation-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SideNavigationBarComponent,
    TranslateModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pawfectCareApp';

  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

}




