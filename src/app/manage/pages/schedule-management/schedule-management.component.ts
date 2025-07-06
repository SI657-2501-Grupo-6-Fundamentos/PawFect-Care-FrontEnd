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
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Schedule } from '../../model/schedule.entity';
import { ScheduleService } from '../../services/schedule.service';

@Component({
  selector: 'app-schedule-management',
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
    RouterModule
  ],
  templateUrl: './schedule-management.component.html',
  styleUrl: './schedule-management.component.css'
})
export class ScheduleManagementComponent implements OnInit {
  schedules: Schedule[] = [];
  veterinarianId: number | null = null;
  displayedColumns: string[] = ['id', 'availableDays', 'startDateTime', 'endDateTime', 'actions'];

  constructor(
    private scheduleService: ScheduleService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.veterinarianId = params['veterinarianId'] ? +params['veterinarianId'] : null;
      this.loadSchedules();
    });
  }

  loadSchedules(): void {
    this.scheduleService.getAll().subscribe({
      next: (data) => {
        // Filter schedules by veterinarianId if provided
        this.schedules = this.veterinarianId
          ? data.filter(schedule => schedule.veterinarianId === this.veterinarianId)
          : data;
      },
      error: (error) => {
        console.error('Error loading schedules:', error);
        this.snackBar.open('Error loading schedules', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  formatDateTime(dateTime: string): string {
    if (!dateTime) return '';
    return new Date(dateTime).toLocaleString();
  }

  formatAvailableDays(days: string): string {
    if (!days) return '';
    return days
      .replace(/_/g, ' ')
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /*
  onViewSchedule(schedule: Schedule): void {
    // Implementation for viewing individual schedule details
    console.log('Viewing schedule:', schedule);
  }

  onEditSchedule(schedule: Schedule): void {
    // Implementation for editing schedule (only for veterinary use)
    console.log('Editing schedule:', schedule);
  }

  onDeleteSchedule(schedule: Schedule): void {
    // Implementation for deleting schedule (only for veterinary use)
    console.log('Deleting schedule:', schedule);
  }*/
}
