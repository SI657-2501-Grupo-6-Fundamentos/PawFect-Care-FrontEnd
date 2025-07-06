import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";

/**
 * Role selection component
 * Allows users to choose between veterinary (ROLE_ADMIN) or pet owner (ROLE_USER) roles
 */
@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './role-section.component.html',
  styleUrl: './role-section.component.css'
})
export class RoleSelectionComponent {

  /**
   * Constructor
   * @param router the router
   */
  constructor(private router: Router) {}

  /**
   * Navigate to pet owner sign up
   */
  onSelectPetOwner() {
    this.router.navigate(['/sign-up'], {
      queryParams: { role: 'pet-owner' }
    });
  }

  /**
   * Navigate to veterinary sign up
   */
  onSelectVeterinary() {
    this.router.navigate(['/sign-up-admin'], {
      queryParams: { role: 'veterinary' }
    });
  }

  /**
   * Navigate to pet owner sign in
   */
  onSignInPetOwner() {
    this.router.navigate(['/sign-in'], {
      queryParams: { role: 'pet-owner' }
    });
  }

  /**
   * Navigate to veterinary sign in
   */
  onSignInVeterinary() {
    this.router.navigate(['/sign-in'], {
      queryParams: { role: 'veterinary' }
    });
  }

  /**
   * Navigate back to home page
   */
  onBackToHome() {
    this.router.navigate(['/']);
  }
}
