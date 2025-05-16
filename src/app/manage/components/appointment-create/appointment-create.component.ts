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

  options: Pet[] = [];

  private petService: PetsService = inject(PetsService);


  @Input() appointment!: Appointment;

  @ViewChild('appointmentForm', { static: false }) protected appointmentForm!: NgForm;

  constructor(private apointmentService: AppointmentsService,private router: Router) {
    this.appointment=new Appointment({});
  }
  ngOnInit() {
    this.getAllPets();
  }
  getAllPets(){
    this.petService.getAll().subscribe((response: Array<Pet>) => {
      this.options=response;
    });
  }

  private resetEditState() {
    this.appointmentForm.reset();
  }

  private isValid(): boolean {
    if(this.appointmentForm.value.petId==0)return false;
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
    this.apointmentService.create(this.appointment).subscribe((response: Appointment) => {
      this.router.navigate(['/manage/appointments']);
      this.resetEditState();
    });
  }

  onCancel() {
    this.router.navigate(['/manage/appointments']);
  }
}
