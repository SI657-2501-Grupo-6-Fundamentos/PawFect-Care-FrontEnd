import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatDatepicker, MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatBadgeModule} from "@angular/material/badge";
import {TranslateModule} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {Appointment} from "../../model/appointment.entity";
import {AppointmentsService} from "../../services/appointments.service";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-appointments-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    MatHeaderCellDef,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatIconModule,
    MatBadgeModule,
    TranslateModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltip
  ],
  templateUrl: './appointments-management.component.html',
  styleUrl: './appointments-management.component.css'
})
export class AppointmentsManagementComponent implements OnInit {
  protected appointmentData!: Appointment;
  protected columnsToDisplay: string[] = [
    "id",
    "appointmentName",
    "registrationDate",
    "endDate",
    "status",
    "actions"
  ];
  protected searchQuery: string = '';
  protected selectedDate: Date = new Date();
  protected appointments: Appointment[] = [];
  protected filteredAppointments: Appointment[] = [];
  protected appointmentsByDate: { [key: string]: Appointment[] } = {};
  protected calendarDays: CalendarDay[] = [];
  protected currentMonth: Date = new Date();
  protected viewMode: 'calendar' | 'table' = 'calendar';

  @ViewChild(MatSort, {static: false})
  protected sort!: MatSort;

  @ViewChild(MatPaginator, {static: false})
  protected paginator!: MatPaginator;

  protected dataSource!: MatTableDataSource<Appointment>;

  private appointmentService: AppointmentsService = inject(AppointmentsService);

  constructor(private router: Router) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.getAllAppointments();
    this.generateCalendarDays();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getAllAppointments() {
    this.appointmentService.getAll().subscribe((response: Array<Appointment>) => {
      this.appointments = response;
      this.dataSource.data = response;
      this.groupAppointmentsByDate();
      this.filterAppointmentsByDate();
      this.generateCalendarDays();
    });
  }

  groupAppointmentsByDate() {
    this.appointmentsByDate = {};
    this.appointments.forEach(appointment => {
      const date = new Date(appointment.registrationDate);
      const dateKey = this.formatDateKey(date);
      if (!this.appointmentsByDate[dateKey]) {
        this.appointmentsByDate[dateKey] = [];
      }
      this.appointmentsByDate[dateKey].push(appointment);
    });
  }

  generateCalendarDays() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    this.calendarDays = [];

    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const dateKey = this.formatDateKey(currentDate);
      const appointmentsCount = this.appointmentsByDate[dateKey]?.length || 0;

      this.calendarDays.push({
        date: currentDate,
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: this.isToday(currentDate),
        isSelected: this.isSameDate(currentDate, this.selectedDate),
        appointmentsCount: appointmentsCount,
        hasAppointments: appointmentsCount > 0
      });
    }
  }

  selectDate(day: CalendarDay) {
    this.selectedDate = day.date;
    this.generateCalendarDays();
    this.filterAppointmentsByDate();
  }

  filterAppointmentsByDate() {
    const dateKey = this.formatDateKey(this.selectedDate);
    this.filteredAppointments = this.appointmentsByDate[dateKey] || [];
  }

  formatDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return this.isSameDate(date, today);
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  previousMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.generateCalendarDays();
  }

  nextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.generateCalendarDays();
  }

  getCurrentMonthName(): string {
    return this.currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  toggleView() {
    this.viewMode = this.viewMode === 'calendar' ? 'table' : 'calendar';
    if (this.viewMode === 'table') {
      this.dataSource.data = this.appointments;
    }
  }

  applyFilter() {
    if (this.viewMode === 'table') {
      this.dataSource.filter = this.searchQuery.trim().toLowerCase();
    } else {
      // Filter appointments by search query for calendar view
      this.filterAppointmentsByDate();
    }
  }

  navigateToAddAppointment() {
    this.router.navigate(['/manage/appointments/add']);
  }

  navigateToEditAppointment(id: number) {
    this.router.navigate([`/manage/appointments/edit/`, id]);
  }

  navigateToCreateReview(idAppointments: number) {
    this.router.navigate([`/manage/appointments/add-review/`, idAppointments]);
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'accent';
      case 'cancelled':
        return 'warn';
      default:
        return 'primary';
    }
  }

  formatTime(date: string): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  appointmentsCount: number;
  hasAppointments: boolean;
}
