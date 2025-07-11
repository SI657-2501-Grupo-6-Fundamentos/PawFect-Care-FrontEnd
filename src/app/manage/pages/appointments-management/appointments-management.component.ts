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
import {TranslateModule} from "@ngx-translate/core";
import {Pet} from "../../model/pet.entity";
import {PetsService} from "../../services/pets.service";
import {Router} from "@angular/router";
import {Appointment} from "../../model/appointment.entity";
import {AppointmentsService} from "../../services/appointments.service";

@Component({
  selector: 'app-appointments-management',
  standalone: true,
  imports: [CommonModule,
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
    TranslateModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './appointments-management.component.html',
  styleUrl: './appointments-management.component.css'
})
export class AppointmentsManagementComponent implements OnInit {
  protected appointmentData!: Appointment;
  protected columnsToDisplay: string[] =  [
    "id",
    "appointmentName",
    "registrationDate",
    "endDate",
    "status",
    "actions"
  ];
  protected   searchQuery: string = '';
  @ViewChild(MatSort, {static: false})
  protected sort!: MatSort;

  @ViewChild(MatPaginator, {static: false})
  protected paginator!: MatPaginator;

  protected dataSource!: MatTableDataSource<Appointment>;

  private appointmentService: AppointmentsService = inject(AppointmentsService);

  constructor(private router: Router) {

    this.dataSource = new MatTableDataSource();
  }

  applyFilter() {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
  }

  ngOnInit() {
    this.getAllAppointments();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getAllAppointments(){
    this.appointmentService.getAll().subscribe((response: Array<Appointment>) => {
      console.log(response)
      this.dataSource.data = response;
    });
  }

  navigateToAddAppointment() {
    this.router.navigate(['/manage/appointments/add']);
  }
  navigateToEditAppointment(idAppointments: number) {
    this.router.navigate([`/manage/appointments/edit/`, idAppointments]);
  }

  navigateToCreateReview(idAppointments: number) {
    this.router.navigate([`/manage/appointments/add-review/`, idAppointments]);
  }
}
