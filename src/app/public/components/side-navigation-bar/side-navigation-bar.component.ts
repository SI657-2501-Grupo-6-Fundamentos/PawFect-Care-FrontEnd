import {MatSidenav, MatSidenavContainer, MatSidenavModule} from "@angular/material/sidenav";
import {MatListItem, MatListModule, MatNavList} from "@angular/material/list";
import {Component, ViewChild} from "@angular/core";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {
  AuthenticationSectionComponent
} from "../../../iam/components/authentication-section/authentication-section.component";
import {MatToolbar, MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule, MatIconButton} from "@angular/material/button";
import {LanguageSwitcherComponent} from "../language-switcher/language-switcher.component";
import {Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet} from "@angular/router";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {AuthenticationService} from "../../../iam/services/authentication.service";
import {TranslateModule} from "@ngx-translate/core";

interface NavigationOption {
  path: string;
  title: string;
  icon: string;
  roles: string[];
}

@Component({
  selector: 'app-side-navigation-bar',
  standalone: true,
  imports: [
    MatSidenavContainer,
    MatNavList,
    //RouterLink,
    MatListItem,
    //RouterLinkActive,
    MatIcon,
    AuthenticationSectionComponent,
    MatToolbar,
    MatIconButton,
    LanguageSwitcherComponent,
    RouterLink,
    NgForOf,
    NgIf,
    MatSidenav,
    RouterLinkActive,
    RouterOutlet,
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './side-navigation-bar.component.html',
  styleUrl: './side-navigation-bar.component.css'
})
export class SideNavigationBarComponent {
  @ViewChild('drawer') drawer!: MatSidenav;

  public isSignedIn: boolean = false;
  public userRole: string | null = null;
  public options: NavigationOption[] = [];

  private allOptions: NavigationOption[] = [

    // Home
    { path: '/', title: 'Home', icon: 'home', roles: ['pet-owner', 'veterinary'] },

    // Admin routes
    { path: '/manage/clients', title: 'List Clients', icon: 'group', roles: ['veterinary'] },
    { path: '/manage/tariffs', title: 'List Services', icon: 'inventory', roles: ['veterinary'] },
    { path: 'manage/veterinarians/schedules', title: 'Schedules', icon: 'schedule', roles: ['veterinary'] },
    { path: '/manage/diagnostics', title: 'Diagnostics', icon: 'medical_services', roles: ['veterinary'] },

    // User routes
    { path: '/manage/veterinarians', title: 'List Veterinarians', icon: 'local_hospital', roles: ['pet-owner'] },
    { path: '/manage/owners/:ownerId/pets', title: 'My Pets', icon: 'pets', roles: ['pet-owner'] },
    { path: '/manage/appointments', title: 'Appointments', icon: 'event', roles: ['pet-owner'] },
    { path: '/manage/list-tariffs', title: 'Veterinarian Services', icon: 'inventory', roles: ['pet-owner'] },
    { path: '/manage/schedules', title: 'Veterinarian Schedules', icon: 'schedule', roles: ['pet-owner'] },

    // Shared

  ];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.isSignedIn.subscribe(isSignedIn => {
      this.isSignedIn = isSignedIn;
    });

    this.authenticationService.currentUserRole.subscribe(role => {
      console.log('[DEBUG] User role received in sidenav:', role);
      this.userRole = role;
      this.updateMenuOptions();
    });

  }

  public updateMenuOptions(): void {
    this.options = this.allOptions.filter(option =>
      option.roles.includes(this.userRole ?? '')
    );
  }

  public toggle(): void {
    this.drawer.toggle();
  }

  resolvePath(path: string): string {
    const ownerId = localStorage.getItem('ownerId');
    if (!ownerId) return path;

    return path.replace(':ownerId', ownerId);
  }
}

