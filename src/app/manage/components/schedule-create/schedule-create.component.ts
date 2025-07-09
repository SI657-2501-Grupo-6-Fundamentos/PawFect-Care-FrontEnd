import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from "@angular/common";
import {ScheduleService} from "../../services/schedule.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-schedule-create',
  templateUrl: './schedule-create.component.html',
  styleUrls: ['./schedule-create.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
  ]
})
export class ScheduleCreateComponent {
  @Output() scheduleCreated = new EventEmitter<void>();
  scheduleForm: FormGroup;

  availableDays = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
  ];

  constructor(private fb: FormBuilder, private scheduleService: ScheduleService, private router: Router) {
    this.scheduleForm = this.fb.group({
      availableDays: ['', Validators.required],
      startDateTime: ['', Validators.required],
      endDateTime: ['', Validators.required],
      veterinarianId: ['', [Validators.required, Validators.min(1)]],
    }, { validators: this.dateTimeValidator });
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
    }
    return null;
  }

  onSubmit() {
    if (this.scheduleForm.valid) {
      const schedule = this.scheduleForm.value;

      this.scheduleService.create(schedule).subscribe({
        next: () => {
          console.log('Horario creado con éxito');
          this.scheduleCreated.emit();
          this.scheduleForm.reset();
          this.router.navigate(['/manage/schedules']);
        },
        error: (error) => {
          console.error('Error al crear horario', error);
        }
      });
    } else {
      this.scheduleForm.markAllAsTouched();
    }
  }

  getFormattedDayName(day: string): string {
    return day.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  get isDateRangeInvalid(): boolean {
    return !!this.scheduleForm.errors?.['invalidDateRange']
      && (this.scheduleForm.dirty || this.scheduleForm.touched);
  }

  cancel(): void {
    this.router.navigate(['/manage/schedules']);
  }
}
