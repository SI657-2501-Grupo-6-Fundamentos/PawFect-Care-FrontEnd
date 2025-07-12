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
import {Appointment, AppointmentStatus} from "../../model/appointment.entity";
import {AppointmentsService} from "../../services/appointments.service";
import {MatTooltip} from "@angular/material/tooltip";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-veterinary-appointments',
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
  templateUrl: './veterinary-appointments-management.component.html',
  styleUrl: './veterinary-appointments-management.component.css'
})
export class VeterinaryAppointmentsManagementComponent implements OnInit {
  protected appointmentData!: Appointment;
  protected columnsToDisplay: string[] = [
    "id",
    "appointmentName",
    "clientName",
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
  private snackBar: MatSnackBar = inject(MatSnackBar);

  protected completedAppointments: Appointment[] = [];
  protected cancelledAppointments: Appointment[] = [];

  constructor(private router: Router) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.getAllPendingAppointments();
    this.getAllCompletedAppointments();
    this.getAllCancelledAppointments();
    this.generateCalendarDays();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Obtiene solo las citas pendientes de aprobación para el proveedor
   */
  getAllPendingAppointments() {
    this.appointmentService.getAll().subscribe({
      next: (response: Array<Appointment>) => {
        // Filtrar solo las citas pendientes o programadas
        this.appointments = response.filter(appointment =>
          appointment.status.toLowerCase() === 'pending' ||
          appointment.status.toLowerCase() === 'scheduled'
        );
        this.dataSource.data = this.appointments;
        this.groupAppointmentsByDate();
        this.filterAppointmentsByDate();
        this.generateCalendarDays();
      },
      error: (error) => {
        console.error('Error al obtener las citas:', error);
        this.snackBar.open('Error al cargar las citas', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  /**
   * Obtiene todas las citas completadas
   */
  getAllCompletedAppointments() {
    this.appointmentService.getAll().subscribe({
      next: (response: Array<Appointment>) => {
        this.completedAppointments = response.filter(appointment =>
          appointment.status.toLowerCase() === 'completed'
        );
      },
      error: (error) => {
        console.error('Error al obtener las citas completadas:', error);
        this.snackBar.open('Error al cargar las citas completadas', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }


  /**
   * Obtiene todas las citas canceladas
   */
  getAllCancelledAppointments() {
    this.appointmentService.getAll().subscribe({
      next: (response: Array<Appointment>) => {
        this.cancelledAppointments = response.filter(appointment =>
          appointment.status.toLowerCase() === 'cancelled'
        );
      },
      error: (error) => {
        console.error('Error al obtener las citas canceladas:', error);
        this.snackBar.open('Error al cargar las citas canceladas', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }


  /**
   * Agrupa las citas por fecha para la vista de calendario
   */
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

  /**
   * Genera los días del calendario para el mes actual
   */
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

  /**
   * Selecciona una fecha específica en el calendario
   */
  selectDate(day: CalendarDay) {
    this.selectedDate = day.date;
    this.generateCalendarDays();
    this.filterAppointmentsByDate();
  }

  /**
   * Filtra las citas por la fecha seleccionada
   */
  filterAppointmentsByDate() {
    const dateKey = this.formatDateKey(this.selectedDate);
    this.filteredAppointments = this.appointmentsByDate[dateKey] || [];
  }

  /**
   * Formatea una fecha para usar como clave
   */
  formatDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  /**
   * Verifica si una fecha es hoy
   */
  isToday(date: Date): boolean {
    const today = new Date();
    return this.isSameDate(date, today);
  }

  /**
   * Compara si dos fechas son iguales
   */
  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  /**
   * Navega al mes anterior
   */
  previousMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.generateCalendarDays();
  }

  /**
   * Navega al mes siguiente
   */
  nextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.generateCalendarDays();
  }

  /**
   * Obtiene el nombre del mes actual
   */
  getCurrentMonthName(): string {
    return this.currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  /**
   * Alterna entre vista de calendario y tabla
   */
  toggleView() {
    this.viewMode = this.viewMode === 'calendar' ? 'table' : 'calendar';
    if (this.viewMode === 'table') {
      this.dataSource.data = this.appointments;
    }
  }

  /**
   * Aplica filtro de búsqueda
   */
  applyFilter() {
    if (this.viewMode === 'table') {
      this.dataSource.filter = this.searchQuery.trim().toLowerCase();
    } else {
      // Para la vista de calendario, filtra las citas del día seleccionado
      const dateKey = this.formatDateKey(this.selectedDate);
      const dayAppointments = this.appointmentsByDate[dateKey] || [];

      if (this.searchQuery.trim()) {
        this.filteredAppointments = dayAppointments.filter(appointment =>
          appointment.appointmentName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (appointment.petId && appointment.petId.toString().includes(this.searchQuery))
        );
      } else {
        this.filteredAppointments = dayAppointments;
      }
    }
  }

  /**
   * Acepta una cita actualizando el estado a COMPLETED
   */
  acceptAppointment(appointment: Appointment) {
    this.appointmentService.updateStatus(appointment.id, AppointmentStatus.COMPLETED).subscribe({
      next: (updatedAppointment) => {
        this.snackBar.open('Cita aceptada y completada exitosamente', 'Cerrar', {
          duration: 3000
        });
        // Actualizar la cita en la lista local
        this.updateAppointmentInList(updatedAppointment);
        // Refrescar la vista
        this.getAllPendingAppointments();
      },
      error: (error) => {
        console.error('Error al aceptar la cita:', error);
        this.snackBar.open('Error al aceptar la cita', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  /**
   * Rechaza una cita actualizando el estado a CANCELLED
   */
  declineAppointment(appointment: Appointment) {
    this.appointmentService.updateStatus(appointment.id, AppointmentStatus.CANCELLED).subscribe({
      next: (updatedAppointment) => {
        this.snackBar.open('Cita rechazada exitosamente', 'Cerrar', {
          duration: 3000
        });
        // Actualizar la cita en la lista local
        this.updateAppointmentInList(updatedAppointment);
        // Refrescar la vista
        this.getAllPendingAppointments();
      },
      error: (error) => {
        console.error('Error al rechazar la cita:', error);
        this.snackBar.open('Error al rechazar la cita', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  /**
   * Actualiza una cita específica en la lista local
   */
  private updateAppointmentInList(updatedAppointment: Appointment) {
    const index = this.appointments.findIndex(app => app.id === updatedAppointment.id);
    if (index !== -1) {
      this.appointments[index] = updatedAppointment;
      this.dataSource.data = this.appointments;
    }
  }

  /**
   * Obtiene el color del estado de la cita
   */
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warn';
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

  /**
   * Formatea la hora de una fecha
   */
  formatTime(date: string): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  /**
   * Navega al home (solo para casos especiales)
   */
  navigateToHome() {
    this.router.navigate(['/home']);
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
