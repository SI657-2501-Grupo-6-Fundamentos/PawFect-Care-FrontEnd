import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from "../../shared/services/base.service";
import { Appointment, AppointmentStatus } from "../model/appointment.entity";

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService extends BaseService<Appointment> {

  constructor() {
    super();
    this.resourceEndPoint = '/appointment-service/api/v1/appointments';
  }

  /**
   * Updates the status of a specific appointment
   * @param id - The appointment ID
   * @param status - The new status to set
   * @returns Observable<Appointment> - The updated appointment
   */
  updateStatus(id: number, status: AppointmentStatus): Observable<Appointment> {
    // First get the current appointment to preserve all existing data
    return new Observable(observer => {
      this.getById(id).subscribe({
        next: (appointment) => {
          // Create update data with all required fields preserved
          const updateData = {
            appointmentName: appointment.appointmentName,
            registrationDate: appointment.registrationDate,
            endDate: appointment.endDate,
            status: status,
            petId: appointment.petId,
            veterinarianId: appointment.veterinarianId,
            tariffId: appointment.tariffId
          };

          // Now update with complete data
          this.update(id, updateData).subscribe({
            next: (updatedAppointment) => {
              observer.next(updatedAppointment);
              observer.complete();
            },
            error: (error) => {
              observer.error(error);
            }
          });
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * Alternative method using PATCH if your backend supports it
   * This is more efficient as it only sends the changed field
   * @param id - The appointment ID
   * @param status - The new status to set
   * @returns Observable<Appointment> - The updated appointment
   */
  patchStatus(id: number, status: AppointmentStatus): Observable<Appointment> {
    const url = `${this.basePath}${this.resourceEndPoint}/${id}/status`;
    return this.http.patch<Appointment>(url, { status: status }, this.httpOptions);
  }

  /**
   * Gets all pending appointments (SCHEDULED or PENDING status)
   * @returns Observable<Appointment[]> - Array of pending appointments
   */
  getPendingAppointments(): Observable<Appointment[]> {
    // If your BaseService has a method to filter, use it
    // Otherwise, you can filter on the frontend after getAll()
    return this.getAll();
  }

  /**
   * Gets appointments by status
   * @param status - The status to filter by
   * @returns Observable<Appointment[]> - Array of appointments with the specified status
   */
  getAppointmentsByStatus(status: AppointmentStatus): Observable<Appointment[]> {
    const url = `${this.basePath}${this.resourceEndPoint}?status=${status}`;
    return this.http.get<Appointment[]>(url, this.httpOptions);
  }
}
