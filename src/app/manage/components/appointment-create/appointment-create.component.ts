import {Component, inject, Input, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, NgForm} from "@angular/forms";
import {MatFormField, MatFormFieldModule, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {Router} from "@angular/router";
import {Appointment, AppointmentStatus} from "../../model/appointment.entity";
import {AppointmentsService} from "../../services/appointments.service";
import {TranslateModule} from "@ngx-translate/core";
import {Pet} from "../../model/pet.entity";
import {PetsService} from "../../services/pets.service";
import {Tariff} from "../../model/tariff.entity";
import {TariffService} from "../../services/tariff.service";
import {Veterinary} from "../../model/veterinary.entity";
import {VeterinaryService} from "../../services/veterinary.service";
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatSelect} from "@angular/material/select";
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatIcon} from "@angular/material/icon";
import { provideNativeDateAdapter } from '@angular/material/core';
import {ClientsService} from "../../services/clients.service";

@Component({
  selector: 'app-appointment-create',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatLabel,
    MatHint,
    TranslateModule,
    MatSelect,
    NgForOf,
    NgIf,
    MatCardTitle,
    MatCardContent,
    MatCardHeader,
    MatCard,
    DatePipe,
    CurrencyPipe,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatIcon,
    MatOptionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './appointment-create.component.html',
  styleUrl: './appointment-create.component.css'
})
export class AppointmentCreateComponent implements OnInit {

  optionsPet: Pet[] = [];
  private petService: PetsService = inject(PetsService);

  optionsTariff: Tariff[] = [];
  private tariffService: TariffService = inject(TariffService);

  optionsVeterinarian: Veterinary[] = [];
  private veterinaryService: VeterinaryService = inject(VeterinaryService);
  @Input() appointment!: Appointment;

  @ViewChild('appointmentForm', { static: false }) protected appointmentForm!: NgForm;

  // Propiedades adicionales para el formulario mejorado
  minDate = new Date();
  maxDate = new Date();
  showPreview = false;
  timeSlots: string[] = [];

  constructor(private appointmentService: AppointmentsService,
              private router: Router,
              private clientsService: ClientsService) {
    this.appointment = new Appointment({});

    // Configurar fechas mínimas y máximas
    this.maxDate.setFullYear(this.maxDate.getFullYear() + 1);

    // Inicializar propiedades del appointment
    this.appointment.status = AppointmentStatus.SCHEDULED
    this.appointment.reminderEnabled = false;
    this.appointment.reminderTime = '30';
    this.appointment.notes = '';
  }

  ngOnInit() {
    this.generateTimeSlots();
    this.getAllPets();
    this.getAllTariffs();
    this.getAllVeterinarians();
    this.setDefaultAppointmentName();
  }

  get selectedTariff(): Tariff | undefined {
    return this.optionsTariff.find(t => t.id === this.appointment.tariffId);
  }

  generateTimeSlots() {
    const slots: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const hh = hour.toString().padStart(2, '0');
        const mm = min.toString().padStart(2, '0');
        slots.push(`${hh}:${mm}`);
      }
    }
    this.timeSlots = slots;
  }

  getAllPets() {
    this.petService.getAll().subscribe((response: Array<Pet>) => {
      this.optionsPet = response;

      // Obtener los dueños de las mascotas
      this.optionsPet.forEach(pet => {
        if (pet.ownerId) {
          this.clientsService.getOwnerById(pet.ownerId).subscribe(owner => {
            // 👉 Añadir dinámicamente el nombre del dueño al objeto `pet`
            (pet as any).ownerName = owner.fullName;
          });
        }
      });
    });
  }


  getAllTariffs() {
    this.tariffService.getAll().subscribe((response: Array<Tariff>) => {
      this.optionsTariff = response;
    });
  }

  getAllVeterinarians() {
    this.veterinaryService.getAll().subscribe((response: Array<Veterinary>) => {
      this.optionsVeterinarian = response;
    });
  }

  setDefaultAppointmentName() {
    this.appointmentService.getAll().subscribe((appointments: Appointment[]) => {
      const nextId = appointments.length + 1;
      this.appointment.appointmentName = `CITA-${nextId}`;
    });
  }


  // Método para establecer duración automáticamente
  setDuration(minutes: number) {
    if (this.appointment.startDateAppointment && this.appointment.startTimeAppointment) {
      const startDateTime = new Date(`${this.appointment.startDateAppointment}T${this.appointment.startTimeAppointment}`);
      const endDateTime = new Date(startDateTime.getTime() + minutes * 60000);

      this.appointment.endDateAppointment = endDateTime.toISOString().split('T')[0];
      this.appointment.endTimeAppointment = endDateTime.toTimeString().split(' ')[0].substring(0, 5);
    }
  }

  // Método para mostrar vista previa
  onPreview() {
    this.showPreview = !this.showPreview;
  }

  // Métodos para obtener nombres seleccionados
  getSelectedPetName(): string {
    const selectedPet = this.optionsPet.find(pet => pet.id === this.appointment.petId);
    return selectedPet ? selectedPet.petName : '';
  }

  getSelectedVeterinarianName(): string {
    const selectedVet = this.optionsVeterinarian.find(vet => vet.id === this.appointment.veterinarianId);
    return selectedVet ? selectedVet.fullName || '' : '';
  }

  getSelectedTariffName(): string {
    const selectedTariff = this.optionsTariff.find(tariff => tariff.id === this.appointment.tariffId);
    return selectedTariff ? selectedTariff.serviceName : '';
  }

  // Validación personalizada para fechas
  validateDates() {
    if (this.appointment.startDateAppointment && this.appointment.endDateAppointment) {
      const startDate = new Date(`${this.appointment.startDateAppointment}T${this.appointment.startTimeAppointment}`);
      const endDate = new Date(`${this.appointment.endDateAppointment}T${this.appointment.endTimeAppointment}`);

      if (endDate <= startDate) {
        // Ajustar automáticamente con duración mínima de 30 minutos
        this.setDuration(30);
      }
    }
  }

  private resetEditState() {
    this.appointmentForm.reset();
    this.showPreview = false;
    this.appointment = new Appointment({});
    this.appointment.status = AppointmentStatus.SCHEDULED;
    this.appointment.reminderEnabled = false;
    this.appointment.reminderTime = '30';
    this.appointment.notes = '';
  }

  private isValid(): boolean {
    if (this.appointmentForm.value.tariffId == 0) return false;
    if (this.appointmentForm.value.petId == 0) return false;
    if (this.appointmentForm.value.veterinarianId == 0) return false;

    // Validar que la fecha de fin sea posterior a la de inicio
    if (this.appointment.startDateAppointment && this.appointment.endDateAppointment) {
      const startDate = new Date(`${this.appointment.startDateAppointment}T${this.appointment.startTimeAppointment}`);
      const endDate = new Date(`${this.appointment.endDateAppointment}T${this.appointment.endTimeAppointment}`);

      if (endDate <= startDate) {
        return false;
      }
    }

    return this.appointmentForm.valid || false;
  }

  onSubmit() {
    // Validar fechas antes de enviar
    this.validateDates();

    if (this.isValid()) {
      this.createAppointment();
      this.resetEditState();
    } else {
      console.error('Invalid form data');
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  }

  createAppointment() {
    try {
      const startDate = new Date(this.appointment.startDateAppointment);
      const endDate = new Date(this.appointment.endDateAppointment);

      const [startHour, startMinute] = this.appointment.startTimeAppointment.split(':').map(Number);
      const [endHour, endMinute] = this.appointment.endTimeAppointment.split(':').map(Number);

      startDate.setHours(startHour, startMinute, 0, 0);
      endDate.setHours(endHour, endMinute, 0, 0);

      const formatLocalISO = (date: Date) => {
        const tzOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - tzOffset).toISOString().slice(0, -1);
      };

      this.appointment.registrationDate = formatLocalISO(startDate);
      this.appointment.endDate = formatLocalISO(endDate);

      console.log('👉 Payload completo:', this.appointment);

      this.appointmentService.create(this.appointment).subscribe((response: Appointment) => {
        const realName = `CITA-${response.id}`;

        // 👇 SOLUCIÓN: Enviar todos los datos necesarios en el update
        const updateData = {
          ...response, // Mantener todos los datos de la respuesta
          appointmentName: realName // Solo cambiar el nombre
        };

        this.appointmentService.update(response.id, updateData).subscribe(() => {
          this.router.navigate(['/manage/appointments']);
          this.resetEditState();
        });
      });

    } catch (err) {
      console.error('Error creando cita:', err);
    }
  }

  onCancel() {
    this.router.navigate(['/manage/appointments']);
  }
}
