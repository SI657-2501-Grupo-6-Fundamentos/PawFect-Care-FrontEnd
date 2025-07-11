import {Component, inject, Input, ViewChild, OnInit} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {DatePipe, NgForOf} from "@angular/common";
import {Pet} from "../../model/pet.entity";
import {PetsService} from "../../services/pets.service";
import {Tariff} from "../../model/tariff.entity";
import {TariffService} from "../../services/tariff.service";
import {Veterinary} from "../../model/veterinary.entity";
import {VeterinaryService} from "../../services/veterinary.service";
import {Appointment} from "../../model/appointment.entity";
import {AppointmentsService} from "../../services/appointments.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-appointment-edit',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormField,
    MatInput,
    MatLabel,
    TranslateModule
  ],
  providers: [DatePipe],
  templateUrl: './appointment-edit.component.html',
  styleUrl: './appointment-edit.component.css'
})
export class AppointmentEditComponent implements OnInit {
  @Input() appointment!: Appointment;

  @ViewChild('appointmentForm', { static: false }) protected appointmentForm!: NgForm;

  optionsPet: Pet[] = [];
  optionsTariff: Tariff[] = [];
  optionsVeterinarian: Veterinary[] = [];
  appointmentId!: number;

  constructor(private datePipe: DatePipe,
              private route: ActivatedRoute,
              private petService: PetsService,
              private tariffService: TariffService,
              private veterinaryService: VeterinaryService,
              private appointmentService: AppointmentsService,
              private router: Router) {
    this.appointment = new Appointment({});
  }

  ngOnInit() {
    // Debug completo de la ruta
    console.log('=== DEBUG DE RUTA ===');
    console.log('URL actual:', this.router.url);
    console.log('Route snapshot:', this.route.snapshot);
    console.log('Route params:', this.route.snapshot.params);
    console.log('Route paramMap:', this.route.snapshot.paramMap);
    console.log('Todos los parámetros:', this.route.snapshot.paramMap.keys);

    // Intentar obtener el ID de diferentes formas
    const idFromParams = this.route.snapshot.params['id'];
    const idFromParamMap = this.route.snapshot.paramMap.get('id');
    const idFromQuery = this.route.snapshot.queryParams['id'];

    console.log('ID from params:', idFromParams);
    console.log('ID from paramMap:', idFromParamMap);
    console.log('ID from queryParams:', idFromQuery);

    // Verificar si es una ruta padre/hijo
    let currentRoute = this.route;
    while (currentRoute.parent) {
      currentRoute = currentRoute.parent;
      console.log('Parent route params:', currentRoute.snapshot.params);
      const parentId = currentRoute.snapshot.paramMap.get('id');
      if (parentId) {
        console.log('ID encontrado en ruta padre:', parentId);
      }
    }

    // Intentar obtener el ID de la URL directamente
    const urlSegments = this.router.url.split('/');
    console.log('URL segments:', urlSegments);
    const possibleId = urlSegments[urlSegments.length - 1];
    console.log('Posible ID desde URL:', possibleId);

    // Determinar el ID a usar
    let finalId: string | null = null;

    if (idFromParamMap) {
      finalId = idFromParamMap;
      console.log('Usando ID de paramMap:', finalId);
    } else if (idFromParams) {
      finalId = idFromParams;
      console.log('Usando ID de params:', finalId);
    } else if (possibleId && !isNaN(Number(possibleId))) {
      finalId = possibleId;
      console.log('Usando ID de URL:', finalId);
    }

    if (!finalId || isNaN(Number(finalId))) {
      console.error('No se pudo obtener un ID válido');
      console.error('URL actual:', this.router.url);
      console.error('Verifica que la ruta esté configurada correctamente');

      // En lugar de redirigir inmediatamente, mostrar un alert para debug
      alert(`Error: No se pudo obtener el ID de la cita. URL actual: ${this.router.url}`);
      this.router.navigate(['/manage/appointments']);
      return;
    }

    this.appointmentId = Number(finalId);

    if (this.appointmentId <= 0) {
      console.error('ID debe ser un número positivo:', this.appointmentId);
      this.router.navigate(['/manage/appointments']);
      return;
    }

    console.log('Appointment ID final:', this.appointmentId);
    console.log('=== FIN DEBUG ===');

    // Cargar datos
    this.loadInitialData();
  }

  private loadInitialData() {
    this.getAllPets();
    this.getAllTariffs();
    this.getAllVeterinarians();
    this.getAppointmentById();
  }

  private resetEditState() {
    this.getAppointmentById();
  }

  private isValid(): boolean {
    if (!this.appointmentForm || !this.appointmentForm.valid) {
      return false;
    }

    if (!this.appointment.id || this.appointment.id <= 0) {
      console.error('Appointment ID no válido:', this.appointment.id);
      return false;
    }

    return true;
  }

  getAllPets(){
    this.petService.getAll().subscribe({
      next: (response: Pet[]) => {
        this.optionsPet = response;
      },
      error: (error) => {
        console.error('Error al cargar mascotas:', error);
      }
    });
  }

  getAllTariffs() {
    this.tariffService.getAll().subscribe({
      next: (response: Tariff[]) => {
        this.optionsTariff = response;
      },
      error: (error) => {
        console.error('Error al cargar tarifas:', error);
      }
    });
  }

  getAllVeterinarians(){
    this.veterinaryService.getAll().subscribe({
      next: (response: Veterinary[]) => {
        this.optionsVeterinarian = response;
      },
      error: (error) => {
        console.error('Error al cargar veterinarios:', error);
      }
    });
  }

  getAppointmentById(){
    if (!this.appointmentId || this.appointmentId <= 0) {
      console.error('ID de cita no válido:', this.appointmentId);
      return;
    }

    this.appointmentService.getById(this.appointmentId).subscribe({
      next: (response: Appointment) => {
        this.appointment = response;

        const dateOnlyStart = this.datePipe.transform(response.registrationDate, 'yyyy-MM-dd') ?? '';
        const timeOnlyStart = this.datePipe.transform(response.registrationDate, 'HH:mm') ?? '';
        const dateOnlyEnd = this.datePipe.transform(response.endDate, 'yyyy-MM-dd') ?? '';
        const timeOnlyEnd = this.datePipe.transform(response.endDate, 'HH:mm') ?? '';

        this.appointment.startDateAppointment = dateOnlyStart;
        this.appointment.startTimeAppointment = timeOnlyStart;
        this.appointment.endDateAppointment = dateOnlyEnd;
        this.appointment.endTimeAppointment = timeOnlyEnd;

        console.log('Appointment cargado:', this.appointment);
      },
      error: (error) => {
        console.error('Error al cargar la cita:', error);
        this.router.navigate(['/manage/appointments']);
      }
    });
  }

  onSubmit() {
    if (this.isValid()) {
      this.editAppointment();
    } else {
      console.error('Formulario inválido o datos incompletos');
    }
  }

  editAppointment() {
    if (!this.appointment.id || this.appointment.id <= 0) {
      console.error('appointment.id no válido:', this.appointment.id);
      return;
    }

    if (!this.appointmentForm.value.startDateAppointment || !this.appointmentForm.value.startTimeAppointment) {
      console.error('Fecha y hora de inicio son requeridas');
      return;
    }

    if (!this.appointmentForm.value.endDateAppointment || !this.appointmentForm.value.endTimeAppointment) {
      console.error('Fecha y hora de fin son requeridas');
      return;
    }

    this.appointment.registrationDate = `${this.appointmentForm.value.startDateAppointment}T${this.appointmentForm.value.startTimeAppointment}`;
    this.appointment.endDate = `${this.appointmentForm.value.endDateAppointment}T${this.appointmentForm.value.endTimeAppointment}`;

    console.log('Actualizando appointment:', this.appointment);

    this.appointmentService.update(this.appointment.id, this.appointment).subscribe({
      next: (response: Appointment) => {
        console.log('Appointment actualizado exitosamente:', response);
        this.router.navigate(['/manage/appointments']);
      },
      error: (error) => {
        console.error('Error al actualizar la cita:', error);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/manage/appointments']);
  }
}
