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
    MatButtonModule
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
    { path: '/manage/clients/add', title: 'Add Client', icon: 'person_add', roles: ['veterinary'] },
    { path: '/manage/veterinarians', title: 'List Veterinarians', icon: 'local_hospital', roles: ['veterinary'] },
    { path: '/manage/tariffs', title: 'List Services', icon: 'inventory', roles: ['veterinary'] },

    // User routes
    { path: '/manage/pets', title: 'My Pets', icon: 'pets', roles: ['pet-owner'] },
    { path: '/manage/appointments', title: 'Appointments', icon: 'event', roles: ['pet-owner'] },

    // Shared
    { path: '/manage/medicalHistory/:id', title: 'Medical History', icon: 'history', roles: ['pet-owner', 'veterinary'] },
    { path: '/manage/appointments/review/:id', title: 'Review Appointment', icon: 'rate_review', roles: ['pet-owner', 'veterinary'] }
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
}

