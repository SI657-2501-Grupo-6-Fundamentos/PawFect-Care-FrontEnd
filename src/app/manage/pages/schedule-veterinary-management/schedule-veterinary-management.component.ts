import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Schedule } from '../../model/schedule.entity';
import { ScheduleService } from '../../services/schedule.service';

@Component({
  selector: 'app-schedule-veterinary-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
    MatDialogModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './schedule-veterinary-management.component.html',
  styleUrl: './schedule-veterinary-management.component.css'
})
export class ScheduleVeterinaryManagementComponent implements OnInit {
  // Data properties
  schedules: Schedule[] = [];
  filteredSchedules: Schedule[] = [];
  veterinarianId: number | null = null;
  uniqueVeterinarians: number[] = [];

  // UI state properties
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showDialog = false;
  showDeleteDialog = false;
  isEditMode = false;
  isSubmitting = false;
  isDeleting = false;

  // Form and filters
  scheduleForm!: FormGroup;
  selectedVeterinarianFilter = '';
  selectedDayFilter = '';
  scheduleToDelete: Schedule | null = null;
  scheduleToEdit: Schedule | null = null;

  // Pagination
  pageSize = 10;
  currentPage = 0;

  // Available days for dropdown
  availableDays = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
  ];

  constructor(
    private scheduleService: ScheduleService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.veterinarianId = params['veterinarianId'] ? +params['veterinarianId'] : null;
      this.loadSchedules();
    });
  }

  private initializeForm(): void {
    this.scheduleForm = this.fb.group(
      {
        availableDays: ['', Validators.required],
        startDateTime: ['', Validators.required],
        endDateTime: ['', Validators.required],
        veterinarianId: ['', [Validators.required, Validators.min(1)]],
      },
      { validators: this.dateTimeValidator }
    );
  }

  private dateTimeValidator(group: FormGroup) {
    const startDateTime = group.get('startDateTime')?.value;
    const endDateTime = group.get('endDateTime')?.value;

    if (startDateTime && endDateTime) {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      const now = new Date();

      if (start >= end) {
        return { invalidDateRange: true };
      }

      if (start < now) {
        return { pastDateTime: true };
      }
    }
    return null;
  }

  loadSchedules(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.scheduleService.getAll().subscribe({
      next: (data) => {
        this.schedules = this.veterinarianId
          ? data.filter(schedule => schedule.veterinarianId === this.veterinarianId)
          : data;

        this.updateUniqueVeterinarians();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading schedules:', error);
        this.errorMessage = 'Error al cargar los horarios. Por favor, inténtalo de nuevo.';
        this.isLoading = false;
      }
    });
  }

  private updateUniqueVeterinarians(): void {
    const veterinarians = [...new Set(this.schedules.map(s => s.veterinarianId))];
    this.uniqueVeterinarians = veterinarians.sort((a, b) => a - b);
  }

  applyFilters(): void {
    let filtered = [...this.schedules];

    if (this.selectedVeterinarianFilter) {
      filtered = filtered.filter(schedule =>
        schedule.veterinarianId === +this.selectedVeterinarianFilter
      );
    }

    if (this.selectedDayFilter) {
      filtered = filtered.filter(schedule =>
        schedule.availableDays === this.selectedDayFilter
      );
    }

    this.filteredSchedules = filtered;
  }

  clearFilters(): void {
    this.selectedVeterinarianFilter = '';
    this.selectedDayFilter = '';
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return this.selectedVeterinarianFilter !== '' || this.selectedDayFilter !== '';
  }

  // Dialog management
  openCreateDialog(): void {
    this.isEditMode = false;
    this.scheduleToEdit = null;
    this.resetForm();
    this.showDialog = true;
  }

  editSchedule(schedule: Schedule): void {
    this.isEditMode = true;
    this.scheduleToEdit = schedule;
    this.populateForm(schedule);
    this.showDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
    this.resetForm();
  }

  private resetForm(): void {
    this.scheduleForm.reset();
    this.scheduleToEdit = null;
  }

  private populateForm(schedule: Schedule): void {
    this.scheduleForm.patchValue({
      availableDays: schedule.availableDays,
      startDateTime: this.formatDateTimeForInput(schedule.startDateTime),
      endDateTime: this.formatDateTimeForInput(schedule.endDateTime),
      veterinarianId: schedule.veterinarianId
    });
  }

  onSubmit(): void {
    if (this.scheduleForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const scheduleData = this.scheduleForm.value;

      if (this.isEditMode && this.scheduleToEdit) {
        this.updateSchedule(this.scheduleToEdit.id, scheduleData);
      } else {
        this.createSchedule(scheduleData);
      }
    } else {
      this.scheduleForm.markAllAsTouched();
    }
  }

  private createSchedule(scheduleData: any): void {
    this.scheduleService.create(scheduleData).subscribe({
      next: (response) => {
        this.successMessage = 'Horario creado exitosamente';
        this.closeDialog();
        this.loadSchedules();
        this.isSubmitting = false;
        this.showSnackBar('Horario creado exitosamente', 'success');
      },
      error: (error) => {
        console.error('Error creating schedule:', error);
        this.errorMessage = 'Error al crear el horario. Por favor, inténtalo de nuevo.';
        this.isSubmitting = false;
        this.showSnackBar('Error al crear el horario', 'error');
      }
    });
  }

  private updateSchedule(id: number, scheduleData: any): void {
    const updatedSchedule = { id, ...scheduleData };

    this.scheduleService.update(id, updatedSchedule).subscribe({
      next: (response) => {
        this.successMessage = 'Horario actualizado exitosamente';
        this.closeDialog();
        this.loadSchedules();
        this.isSubmitting = false;
        this.showSnackBar('Horario actualizado exitosamente', 'success');
      },
      error: (error) => {
        console.error('Error updating schedule:', error);
        this.errorMessage = 'Error al actualizar el horario. Por favor, inténtalo de nuevo.';
        this.isSubmitting = false;
        this.showSnackBar('Error al actualizar el horario', 'error');
      }
    });
  }

  // Delete functionality
  deleteSchedule(schedule: Schedule): void {
    this.scheduleToDelete = schedule;
    this.showDeleteDialog = true;
  }

  closeDeleteDialog(): void {
    this.showDeleteDialog = false;
    this.scheduleToDelete = null;
  }

  confirmDelete(): void {
    if (this.scheduleToDelete && !this.isDeleting) {
      this.isDeleting = true;

      this.scheduleService.delete(this.scheduleToDelete.id).subscribe({
        next: () => {
          this.successMessage = 'Horario eliminado exitosamente';
          this.closeDeleteDialog();
          this.loadSchedules();
          this.isDeleting = false;
          this.showSnackBar('Horario eliminado exitosamente', 'success');
        },
        error: (error) => {
          console.error('Error deleting schedule:', error);
          this.errorMessage = 'Error al eliminar el horario. Por favor, inténtalo de nuevo.';
          this.isDeleting = false;
          this.showSnackBar('Error al eliminar el horario', 'error');
        }
      });
    }
  }

  // View functionality
  viewSchedule(schedule: Schedule): void {
    this.router.navigate(['/schedule/view', schedule.id]);
  }

  // Permission checks
  canEditSchedule(schedule: Schedule): boolean {
    // Check if schedule is not in the past
    const now = new Date();
    const startDateTime = new Date(schedule.startDateTime);
    return startDateTime > now;
  }

  canDeleteSchedule(schedule: Schedule): boolean {
    // Check if schedule is not in the past and not currently active
    const now = new Date();
    const startDateTime = new Date(schedule.startDateTime);
    return startDateTime > now;
  }

  // Utility methods
  formatDateTime(dateTime: string): string {
    if (!dateTime) return '';
    return new Date(dateTime).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDateTimeForInput(dateTime: string): string {
    if (!dateTime) return '';

    try {
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) return '';

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  formatAvailableDays(days: string): string {
    if (!days) return '';
    return this.getFormattedDayName(days);
  }

  getFormattedDayName(day: string): string {
    const dayNames: { [key: string]: string } = {
      'MONDAY': 'Lunes',
      'TUESDAY': 'Martes',
      'WEDNESDAY': 'Miércoles',
      'THURSDAY': 'Jueves',
      'FRIDAY': 'Viernes',
      'SATURDAY': 'Sábado',
      'SUNDAY': 'Domingo'
    };
    return dayNames[day] || day;
  }

  getScheduleStatus(schedule: Schedule): string {
    const now = new Date();
    const start = new Date(schedule.startDateTime);
    const end = new Date(schedule.endDateTime);

    if (now < start) {
      return 'Programado';
    } else if (now >= start && now <= end) {
      return 'Activo';
    } else {
      return 'Finalizado';
    }
  }

  isScheduleActive(schedule: Schedule): boolean {
    const now = new Date();
    const start = new Date(schedule.startDateTime);
    const end = new Date(schedule.endDateTime);
    return now >= start && now <= end;
  }

  // Form validation getters
  get isDateRangeInvalid(): boolean {
    return !!this.scheduleForm.errors?.['invalidDateRange']
      && (this.scheduleForm.dirty || this.scheduleForm.touched);
  }

  get isPastDateTime(): boolean {
    return !!this.scheduleForm.errors?.['pastDateTime']
      && (this.scheduleForm.dirty || this.scheduleForm.touched);
  }

  // Pagination
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
  }

  // TrackBy function for performance
  trackByScheduleId(index: number, schedule: Schedule): number {
    return schedule.id;
  }

  // Message handling
  clearError(): void {
    this.errorMessage = '';
  }

  clearSuccess(): void {
    this.successMessage = '';
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
