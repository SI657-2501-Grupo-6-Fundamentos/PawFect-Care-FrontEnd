import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from "../../../shared/components/base-form.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {SignInRequest} from "../../model/sign-in.request";
import {MatCard, MatCardContent, MatCardHeader, MatCardModule, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

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
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent extends BaseFormComponent implements OnInit{
  form!: FormGroup;
  submitted = false;
  private clientId = '943349664550-d4lnk7sa26hl4n8n0siq13e2n9gq6i3a.apps.googleusercontent.com'; // Replace with your actual client ID

  // Role from query params
  selectedRole: string = '';

  /**
   * Constructor
   * @param builder {@link FormBuilder} instance
   * @param authenticationService {@link AuthenticationService} instance
   * @param route {@link ActivatedRoute} instance
   */
  constructor(
    private router: Router,
    private builder: FormBuilder,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) {
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

    // Get query parameters
    this.route.queryParams.subscribe(params => {
      this.selectedRole = params['role'] || '';

      // Always load Google Sign-In
      this.loadGoogleSignIn();
    });
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

    // Call the appropriate authentication method based on selected role
    if (this.selectedRole === 'veterinary') {
      this.authenticationService.signInUserAdminWithGoogle(idToken);
    } else {
      // Default to pet owner (regular user)
      this.authenticationService.signInUserWithGoogle(idToken);
    }
  }

  /**
   * On Submit Event Handler
   * <p>
   *  Submit the form data to the server for traditional login
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

  /**
   * Navigate back to role selection
   */
  navigateToRegister(): void {
    this.router.navigate(['/select-role']);
  }
}
