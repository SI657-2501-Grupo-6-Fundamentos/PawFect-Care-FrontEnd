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
  roles: string[] = ['ROLE_USER']; // Available roles

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
  /*ngOnInit(): void {
    this.form = this.builder.group({
      userName : ['', Validators.required],
      password: ['', Validators.required],
      role: ['ROLE_USER', Validators.required], // Default role
    });
  }*/

  ngOnInit(): void {
    this.form = this.builder.group({
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      password: ['', Validators.required],
      role: ['USER', Validators.required] // Valor por defecto si lo deseas
    });
  }

  /**
   * On Submit Event Handler
   * <p>
   *  Submit form
   * </p>
   */
  /*onSubmit(): void {
    if (this.form.invalid) return;
    const { userName, password, role } = this.form.value;
    const signUpRequest = new SignUpRequest(userName, password, role); // Include role
    this.authenticationService.signUp(signUpRequest);
    this.submitted = true;
  }*/
  onSubmit(): void {
    if (this.form.invalid) return;

    const {
      fullName,
      userName,
      email,
      phoneNumber,
      address,
      password,
      role
    } = this.form.value;

    const signUpRequest = new SignUpRequest(
      userName,
      role,
      fullName,
      phoneNumber,
      email,
      address,
      password
    );

    this.authenticationService.signUp(signUpRequest);
    this.submitted = true;
  }

  navigateToLogin(): void {
    this.router.navigate(['/sign-in']);
  }
}
