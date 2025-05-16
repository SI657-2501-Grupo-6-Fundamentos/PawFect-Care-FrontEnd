import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';  // Asegúrate de tener importado RouterOutlet
import { TranslateLoader, TranslateService, TranslateModule } from "@ngx-translate/core";

import { SideNavigationBarComponent } from './public/components/side-navigation-bar/side-navigation-bar.component';
import {LanguageSwitcherComponent} from "./public/components/language-switcher/language-switcher.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SideNavigationBarComponent,
    TranslateModule,
    LanguageSwitcherComponent
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




