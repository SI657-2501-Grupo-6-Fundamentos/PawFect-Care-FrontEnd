import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatRow,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MedicalAppointment } from '../../model/medical-appointment.entity';
import { MedicalAppointmentService } from '../../services/medical-appointment.service';
import { AppointmentsService } from '../../services/appointments.service';
import { Appointment } from '../../model/appointment.entity';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
@Component({
  selector: 'app-medical-history-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatPaginator,
    MatRow,
    MatSort,
    MatTable,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButton,
    TranslateModule,
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  templateUrl: './medical-history-management.component.html',
  styleUrls: ['./medical-history-management.component.css']
})
export class MedicalHistoryManagementComponent {
  // Propiedad para el texto ingresado por el usuario
  protected newHistoryDescription: string = '';
  isEditing: boolean = false;
  medicalHistoryId!: number;
  private medicalAppointmentService: MedicalAppointmentService = inject(MedicalAppointmentService);

  private appointmentService: AppointmentsService = inject(AppointmentsService);

  @ViewChild(MatSort, { static: false })
  protected sort!: MatSort;

  @ViewChild(MatPaginator, { static: false })
  protected paginator!: MatPaginator;

  protected dataSource: MatTableDataSource<any>;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.medicalHistoryId = +this.route.snapshot.paramMap.get('id')!;
    this.getAllMedicalAppointmentsWithDetails();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getAppointmentById(appointmentId: number) {
    this.appointmentService.getById(appointmentId).subscribe((response: Appointment) => {
      console.log(response);
    });
  }

  editHistory(record: any) {
    record.isEditing = !record.isEditing;
    if (!record.isEditing) {
      const updatedRecord = {
        ...record,
        isEditing: !record.isEditing,
        diagnosis: record.diagnosis,
        notes: record.notes,
        treatment: record.treatment,
      }
      this.medicalAppointmentService.update(record.id, updatedRecord).subscribe({
        next: (updatedRecord) => {
          console.log('Record updated successfully:', updatedRecord);
          const index = this.dataSource.data.findIndex(item => item.id === record.id);
          if (index !== -1) {
            this.dataSource.data[index] = updatedRecord;
          }
        },
        error: (error) => {
          console.error('Error updating record:', error);
          record.isEditing = true;
        },
      });


    } 
  }

  getAllMedicalAppointmentsWithDetails() {
    this.medicalAppointmentService.getAllMedicalAppointmentsByMedicalHistoryId(this.medicalHistoryId).subscribe((medicalAppointments: Array<MedicalAppointment>) => {
      // Crear una nueva lista para almacenar las citas con detalles
      const enhancedMedicalAppointments: Array<any> = [];
      medicalAppointments.forEach((medicalAppointment) => {
        this.appointmentService.getById(medicalAppointment.appointmentId).subscribe((appointment: Appointment) => {
          // Agregar los detalles de la cita al objeto actual
          enhancedMedicalAppointments.push({
            ...medicalAppointment,
            ...appointment,
            isEditing: false
          });

          if (enhancedMedicalAppointments.length === medicalAppointments.length) {
            this.dataSource.data = enhancedMedicalAppointments.sort((a, b) => a.id - b.id);
          }
        });
      });
    });
  }

  // Añadir una nueva descripción al historial

}

