import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Veterinary, VeterinarianSpeciality } from '../../model/veterinary.entity';
import { VeterinaryService } from '../../services/veterinary.service';
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-veterinary-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    RouterModule,
    MatTooltip
  ],
  templateUrl: './veterinary-management.component.html',
  styleUrl: './veterinary-management.component.css'
})
export class VeterinaryManagementComponent implements OnInit {
  veterinarians: Veterinary[] = [];
  displayedColumns: string[] = ['id', 'fullName', 'email', 'phoneNumber', 'dni', 'veterinarianSpeciality', 'availableStartTime', 'availableEndTime', 'actions'];
  specialities = Object.values(VeterinarianSpeciality);

  constructor(
    private veterinaryService: VeterinaryService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadVeterinarians();
  }

  loadVeterinarians(): void {
    this.veterinaryService.getAll().subscribe({
      next: (data) => {
        this.veterinarians = data;
      },
      error: (error) => {
        console.error('Error loading veterinarians:', error);
        this.snackBar.open('Error loading veterinarians', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onViewAvailability(veterinarian: Veterinary): void {
    // Navigate to schedule management component with veterinarian ID
    this.router.navigate(['/manage/veterinarians/schedules', veterinarian.id]);
  }

  formatDateTime(dateTime: string): string {
    if (!dateTime) return '';
    return new Date(dateTime).toLocaleString();
  }

  getSpecialityDisplayName(speciality: VeterinarianSpeciality | undefined | null): string {
    const safeSpeciality = speciality ?? 'GENERAL';
    return safeSpeciality
      .replace(/_/g, ' ')
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
