import {Component, inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {Router} from "@angular/router";
import {Appointment} from "../../model/appointment.entity";
import {AppointmentsService} from "../../services/appointments.service";
import {MatSlideToggle} from "@angular/material/slide-toggle";
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
import {TranslateModule} from "@ngx-translate/core";
import {Pet} from "../../model/pet.entity";
import {PetsService} from "../../services/pets.service";
import {Tariff} from "../../model/tariff.entity";
import {TariffService} from "../../services/tariff.service";
import {Veterinary} from "../../model/veterinary.entity";
import {VeterinaryService} from "../../services/veterinary.service";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {Client} from "../../model/client.entity";

@Component({
  selector: 'app-appointment-create',
  standalone: true,
  imports: [FormsModule,
    MatFormField,
    MatInput,
    MatButton, MatLabel, MatSlideToggle, MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatPaginator, MatRow, MatRowDef, MatSort, MatSortHeader, MatTable, TranslateModule, MatHeaderCellDef, MatOption, MatSelect, NgForOf],
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

  constructor(private appointmentService: AppointmentsService,private router: Router) {
    this.appointment=new Appointment({});
  }
  ngOnInit() {
    this.getAllPets();
    this.getAllTariffs();
    this.getAllVeterinarians();
  }
  getAllPets(){
    this.petService.getAll().subscribe((response: Array<Pet>) => {
      this.optionsPet=response;
    });
  }

  getAllTariffs() {
    this.tariffService.getAll().subscribe((response: Array<Tariff>) => {
      this.optionsTariff=response;
    });
  }

  getAllVeterinarians(){
    this.veterinaryService.getAll().subscribe((response: Array<Veterinary>) => {
      this.optionsVeterinarian=response;
    });
  }

  private resetEditState() {
    this.appointmentForm.reset();
  }

  private isValid(): boolean {
    if(this.appointmentForm.value.tariffId==0)return false;
    if(this.appointmentForm.value.petId==0)return false;
    if(this.appointmentForm.value.veterinarianId==0)return false;
    return this.appointmentForm.valid || false;
  }

  onSubmit() {
    if (this.isValid()) {
      this.createAppointment();
   this.resetEditState();
    } else {
      console.error('Invalid form data');
    }
  }

  createAppointment() {

    this.appointment.registrationDate=`${this.appointmentForm.controls['startDateAppointment']?.value}T${this.appointmentForm.controls['startTimeAppointment']?.value}`
    this.appointment.endDate=`${this.appointmentForm.controls['endDateAppointment']?.value}T${this.appointmentForm.controls['endTimeAppointment']?.value}`
    this.appointmentService.create(this.appointment).subscribe((response: Appointment) => {
      this.router.navigate(['/manage/appointments']);
      this.resetEditState();
    });
  }

  onCancel() {
    this.router.navigate(['/manage/appointments']);
  }
}
