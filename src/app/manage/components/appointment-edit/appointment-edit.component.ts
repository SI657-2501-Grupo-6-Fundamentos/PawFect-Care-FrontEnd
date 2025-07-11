import {Component, inject, Input, ViewChild} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatSlideToggle} from "@angular/material/slide-toggle";
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
import {Client} from "../../model/client.entity";
import {ClientsService} from "../../services/clients.service";
import {TranslateModule} from "@ngx-translate/core";

class ngOnInit {
}

@Component({
  selector: 'app-appointment-edit',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSlideToggle,
    NgForOf,
    TranslateModule
  ],
  providers: [DatePipe],
  templateUrl: './appointment-edit.component.html',
  styleUrl: './appointment-edit.component.css'
})
export class AppointmentEditComponent implements ngOnInit{
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
    this.appointmentId = +this.route.snapshot.paramMap.get('id')!;
    this.getAllPets();
    this.getAllTariffs();
    this.getAllVeterinarians();
    this.getAppointmentById();
  }

  private resetEditState() {
    this.getAppointmentById();
  }

  private isValid(): boolean {
    if(this.appointmentForm.value.ownerId==0)return false;
    return this.appointmentForm.valid || false;
  }

  getAllPets(){
    this.petService.getAll().subscribe((response: Pet[]) => {
      this.optionsPet=response;
    });
  }

  getAllTariffs() {
    this.tariffService.getAll().subscribe((response: Tariff[]) => {
      this.optionsTariff=response;
    });
  }

  getAllVeterinarians(){
    this.veterinaryService.getAll().subscribe((response: Veterinary[]) => {
      this.optionsVeterinarian=response;
    });
  }

  getAppointmentById(){
    this.appointmentService.getById(this.appointmentId).subscribe((response: Appointment) => {
      this.appointment = response;
      const dateOnlyStart = this.datePipe.transform(response.registrationDate, 'yyyy-MM-dd')??'';
      const timeOnlyStart = this.datePipe.transform(response.registrationDate, 'HH:mm')??'';
      const dateOnlyEnd = this.datePipe.transform(response.endDate, 'yyyy-MM-dd')??'';
      const timeOnlyEnd = this.datePipe.transform(response.endDate, 'HH:mm')??'';
      this.appointment.startDateAppointment=dateOnlyStart;
      this.appointment.startTimeAppointment=timeOnlyStart;
      this.appointment.endDateAppointment=dateOnlyEnd;
      this.appointment.endTimeAppointment=timeOnlyEnd;
    });
  }


  onSubmit() {
    if (this.isValid()) {
      this.editAppointment();
      this.resetEditState();
    } else {
      console.error('Invalid form data');
    }
  }

  editAppointment() {
    this.appointment.registrationDate=`${this.appointmentForm.value.startDateAppointment}T${this.appointmentForm.value.startTimeAppointment}`
    this.appointment.endDate=`${this.appointmentForm.value.endDateAppointment}T${this.appointmentForm.value.startTimeAppointment}`
    this.appointmentService.update(this.appointment.id,this.appointment).subscribe((response: Appointment) => {
      console.log(response)
      this.router.navigate(['/manage/appointments']);
      this.resetEditState();
    });
  }

  onCancel() {
    this.router.navigate(['/manage/appointments']);
  }

}
