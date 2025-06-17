import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { LanguageSwitcherComponent } from "../../../public/components/language-switcher/language-switcher.component";


/**
 * Authentication section component
 */
@Component({
  selector: 'app-authentication-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
],
  templateUrl: './authentication-section.component.html',
  styleUrl: './authentication-section.component.css'
})
export class AuthenticationSectionComponent {
  currentEmail: string = '';
  isSignedIn: boolean = false;

  /**
   * Constructor
   * @param router the router
   * @param authenticationService the authentication service
   */
  constructor(private router: Router, private authenticationService: AuthenticationService) {
    this.authenticationService.currentEmail.subscribe(email => this.currentEmail = email);
    this.authenticationService.isSignedIn.subscribe(isSignedIn => this.isSignedIn = isSignedIn);
  }

  /**
   * Sign In Event Handler
   */
  onSignIn() {
    this.router.navigate(['/sign-in']).then();
  }

  /**
   * Sign Up Event Handler
   */
  onSignUp() {
    this.router.navigate(['/sign-up']).then();
  }

  /**
   * Sign Out Event Handler
   */
  onSignOut() {
    this.authenticationService.signOut();
  }
}
