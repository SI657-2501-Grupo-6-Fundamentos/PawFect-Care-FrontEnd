import { Injectable } from "@angular/core";
import { MedicalAppointment } from '../model/medical-appointment.entity';
import { BaseService } from "../../shared/services/base.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class MedicalAppointmentService extends BaseService<MedicalAppointment> {
    constructor() { 
      super();
      this.resourceEndPoint = '/api/v1/medical_appointments';
    }

    public getAllMedicalAppointmentsByMedicalHistoryId(medicalHistoryId: number): Observable<MedicalAppointment[]> {
      const url = `${this.basePath}/api/v1/medical_appointments/medical_history/${medicalHistoryId}`;
      return this.http.get<MedicalAppointment[]>(url, this.httpOptions);
    }
  }
  
  
  