import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from "@angular/common";
import {Schedule} from "../../model/schedule.entity";
import {ScheduleService} from "../../services/schedule.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-schedule-edit',
  templateUrl: './schedule-edit.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./schedule-edit.component.css']
})
export class ScheduleEditComponent implements OnInit {
  @Input() scheduleData!: Schedule;
  @Output() scheduleUpdated = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  scheduleForm!: FormGroup;
  scheduleId: number | null = null;
  isLoading = false;
  errorMessage = '';

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
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get schedule ID from route parameters
    this.route.params.subscribe(params => {
      this.scheduleId = params['id'] ? +params['id'] : null;

      if (this.scheduleId) {
        this.loadSchedule(this.scheduleId);
      } else if (this.scheduleData) {
        this.initializeForm();
      }
    });
  }

  private loadSchedule(id: number): void {
    this.isLoading = true;
    this.scheduleService.getById(id).subscribe({
      next: (schedule) => {
        this.scheduleData = schedule;
        this.initializeForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading schedule:', error);
        this.errorMessage = 'Error al cargar el horario';
        this.isLoading = false;
      }
    });
  }

  private initializeForm(): void {
    this.scheduleForm = this.fb.group(
      {
        availableDays: [this.scheduleData?.availableDays || '', Validators.required],
        startDateTime: [this.formatDateTimeForInput(this.scheduleData?.startDateTime) || '', Validators.required],
        endDateTime: [this.formatDateTimeForInput(this.scheduleData?.endDateTime) || '', Validators.required],
        veterinarianId: [this.scheduleData?.veterinarianId || '', [Validators.required, Validators.min(1)]],
      },
      { validators: this.dateTimeValidator }
    );
  }

  dateTimeValidator(group: FormGroup) {
    const startDateTime = group.get('startDateTime')?.value;
    const endDateTime = group.get('endDateTime')?.value;

    if (startDateTime && endDateTime) {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);

      if (start >= end) {
        return { invalidDateRange: true };
      }

      // Additional validation: check if start time is in the past
      const now = new Date();
      if (start < now) {
        return { pastDateTime: true };
      }
    }
    return null;
  }

  formatDateTimeForInput(dateTime: string): string {
    if (!dateTime) return '';

    try {
      // Handle different date formats
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) return '';

      // Format for datetime-local input: YYYY-MM-DDTHH:MM
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

  onSubmit() {
    if (this.scheduleForm.valid && this.scheduleId) {
      this.isLoading = true;
      this.errorMessage = '';

      const updatedSchedule = {
        id: this.scheduleId,
        ...this.scheduleForm.value
      };

      this.scheduleService.update(this.scheduleId, updatedSchedule).subscribe({
        next: (response) => {
          console.log('Horario actualizado exitosamente:', response);
          this.scheduleUpdated.emit();
          this.isLoading = false;
          this.router.navigate(['/manage/schedules']);
        },
        error: (error) => {
          console.error('Error al actualizar horario:', error);
          this.errorMessage = 'Error al actualizar el horario. Por favor, intente nuevamente.';
          this.isLoading = false;
        }
      });
    } else {
      this.scheduleForm.markAllAsTouched();
      this.errorMessage = 'Por favor, complete todos los campos requeridos correctamente.';
    }
  }

  get isDateRangeInvalid(): boolean {
    return !!this.scheduleForm.errors?.['invalidDateRange']
      && (this.scheduleForm.dirty || this.scheduleForm.touched);
  }

  get isPastDateTime(): boolean {
    return !!this.scheduleForm.errors?.['pastDateTime']
      && (this.scheduleForm.dirty || this.scheduleForm.touched);
  }

  cancel() {
    this.cancelled.emit();
    this.router.navigate(['/manage/schedules']);
  }

  // Utility method to check if form field has error
  hasError(fieldName: string): boolean {
    const field = this.scheduleForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Get specific error message for a field
  getErrorMessage(fieldName: string): string {
    const field = this.scheduleForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Este campo es requerido';
    if (field.errors['min']) return 'El valor debe ser mayor a 0';

    return 'Campo inválido';
  }
}
