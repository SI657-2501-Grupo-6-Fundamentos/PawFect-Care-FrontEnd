import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from "../../../shared/components/base-form.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {SignUpAdminRequest} from "../../model/sign-up-admin.request";
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import {MatOption, MatSelect} from "@angular/material/select";

export enum VeterinarianSpeciality {
  GENERAL_MEDICINE = 'GENERAL MEDICINE',
  VETERINARY_SURGERY = 'VETERINARY SURGERY',
  VETERINARY_PATHOLOGY = 'VETERINARY PATHOLOGY',
  VETERINARY_RADIOLOGY = 'VETERINARY RADIOLOGY',
  VETERINARY_NUTRITION = 'VETERINARY NUTRITION',
  VETERINARY_BEHAVIOR = 'VETERINARY BEHAVIOR',
  VETERINARY_OPHTHALMOLOGY = 'VETERINARY OPHTHALMOLOGY',
  VETERINARY_DERMATOLOGY = 'VETERINARY DERMATOLOGY',
  VETERINARY_CARDIOLOGY = 'VETERINARY CARDIOLOGY',
  VETERINARY_ONCOLOGY = 'VETERINARY ONCOLOGY',
  VETERINARY_NEUROLOGY = 'VETERINARY NEUROLOGY',
  VETERINARY_ORTHOPEDICS = 'VETERINARY ORTHOPEDICS',
  VETERINARY_PHYSIOTHERAPY = 'VETERINARY PHYSIOTHERAPY',
  EMERGENCY_AND_CRITICAL_CARE = 'EMERGENCY AND CRITICAL CARE'
}

/**
 * Sign up vet component
 */
@Component({
  selector: 'app-sign-up-admin',
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
  templateUrl: './sign-up-admin.component.html',
  styleUrl: './sign-up-admin.component.css'
})
export class SignUpAdminComponent extends BaseFormComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  roles: string[] = ['ROLE_ADMIN']; // Available roles

  public specialities: string[] = Object.values(VeterinarianSpeciality);

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
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      dni: ['', Validators.required],
      speciality: ['', Validators.required],
      availableStartTime: ['', Validators.required],
      availableEndTime: ['', Validators.required],
      password: ['', Validators.required],
      role: ['ADMIN', Validators.required] // Valor por defecto si lo deseas
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

    console.log('Form value:', this.form.value);

    const {
      fullName,
      userName,
      email,
      phoneNumber,
      dni,
      speciality,
      availableStartTime,
      availableEndTime,
      password,
      role
    } = this.form.value;


    const today = new Date().toISOString().split('T')[0];

    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatDateToLocalDateTime = (date: Date): string => {
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };
    const startTime = new Date(`${today}T${availableStartTime}:00`);
    const endTime = new Date(`${today}T${availableEndTime}:00`);

    const signUpAdminRequest = new SignUpAdminRequest(
      userName,
      role,
      fullName,
      phoneNumber,
      email,
      dni,
      speciality,
      formatDateToLocalDateTime(startTime),
      formatDateToLocalDateTime(endTime),
      password
    );

    this.authenticationService.signUpAdmin(signUpAdminRequest);
    this.submitted = true;
  }

  navigateToLogin(): void {
    this.router.navigate(['/sign-in']);
  }

}
