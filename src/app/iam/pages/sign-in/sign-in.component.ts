import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from "../../../shared/components/base-form.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {SignInRequest} from "../../model/sign-in.request";
import {MatCard, MatCardContent, MatCardHeader, MatCardModule, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

/**
 * Sign in component
 */
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    TranslateModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent extends BaseFormComponent implements OnInit{
  form!: FormGroup;
  submitted = false;
  private clientId = '943349664550-d4lnk7sa26hl4n8n0siq13e2n9gq6i3a.apps.googleusercontent.com'; // Replace with your actual client ID

  /**
   * Constructor
   * @param builder {@link FormBuilder} instance
   * @param authenticationService {@link AuthenticationService} instance
   */
  constructor(private router: Router, private builder: FormBuilder, private authenticationService: AuthenticationService) {
    super();
  }

  /**
   * On Init Event Handler
   * <p>
   *  Initialize the component
   * </p>
   */
  ngOnInit(): void {
    this.form = this.builder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Initialize Google Sign-In after component loads
    this.loadGoogleSignIn();
  }

  /**
   * Load Google Sign-In script and initialize
   */
  private loadGoogleSignIn(): void {
    // Check if Google Sign-In script is already loaded
    if (typeof (window as any).google !== 'undefined') {
      this.renderGoogleButton();
      return;
    }

    // Load Google Sign-In script dynamically
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.renderGoogleButton();
    };
    document.head.appendChild(script);
  }

  /**
   * Render Google Sign-In button
   */
  private renderGoogleButton(): void {
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: this.handleGoogleCredentialResponse.bind(this)
    });

    // @ts-ignore
    google.accounts.id.renderButton(
      document.getElementById("googleSignInBtn"),
      {
        theme: "outline",
        size: "large",
        width: "100%",
        text: "signin_with"
      }
    );
  }

  /**
   * Handle Google Sign-In credential response
   * @param response Google credential response
   */
  private handleGoogleCredentialResponse(response: any): void {
    const idToken = response.credential;
    console.log('Google ID Token received:', idToken);

    // Call your authentication service to handle Google sign-in
    this.authenticationService.signInWithGoogle(idToken);
  }

  /**
   * On Submit Event Handler
   * <p>
   *  Submit the form data to the server
   * </p>
   */
  onSubmit() {
    if (this.form.invalid) return;
    let userName = this.form.value.userName;
    let password = this.form.value.password;
    const signInRequest = new SignInRequest(userName, password);
    this.authenticationService.signIn(signInRequest);
    this.submitted = true;
  }

  navigateToRegister(): void {
    this.router.navigate(['/sign-up']);
  }
}
