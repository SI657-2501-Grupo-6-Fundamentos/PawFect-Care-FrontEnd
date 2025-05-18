import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from "../../../shared/components/base-form.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {SignUpRequest} from "../../model/sign-up.request";
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import {MatOption, MatSelect} from "@angular/material/select";

/**
 * Sign up component
 */
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatSelect,
    MatOption
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent extends BaseFormComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  roles: string[] = ['ROLE_USER', 'ROLE_ADMIN']; // Available roles

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
   *  Initialize component
   * </p>
   */
  ngOnInit(): void {
    this.form = this.builder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['ROLE_USER', Validators.required], // Default role
    });
  }

  /**
   * On Submit Event Handler
   * <p>
   *  Submit form
   * </p>
   */
  onSubmit(): void {
    if (this.form.invalid) return;
    const { username, password, role } = this.form.value;
    const signUpRequest = new SignUpRequest(username, password, role); // Include role
    this.authenticationService.signUp(signUpRequest);
    this.submitted = true;
  }

  navigateToLogin(): void {
    this.router.navigate(['/sign-in']);
  }
}
