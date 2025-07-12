import { Injectable } from '@angular/core';
import { BaseService } from "../../shared/services/base.service";
import { MedicalRecord } from "../model/medical-record.entity";
import {Observable} from "rxjs";
import {Pet} from "../model/pet.entity";

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService extends BaseService<MedicalRecord>{
  constructor() {
    super();
    this.resourceEndPoint = '/medical-record-service/api/v1/medical-records';
  }

  public getDiagnosticsByMedicalRecordId(medicalRecordId: number): Observable<MedicalRecord[]> {
    const url = `${this.basePath}/medical-record-service/api/v1/pet-owners/${ownerId}/pets`;
    console.log('GET URL:', url);  // Verifica que esté bien formada
    return this.http.get<MedicalRecord[]>(url, this.httpOptions);
  }
}
