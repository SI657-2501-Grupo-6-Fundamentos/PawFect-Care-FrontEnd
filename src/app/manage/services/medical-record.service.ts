import { Injectable } from '@angular/core';
import { BaseService } from "../../shared/services/base.service";
import { MedicalRecord } from "../model/medical-record.entity";

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService extends BaseService<MedicalRecord>{
  constructor() {
    super();
    this.resourceEndPoint = '/medicalRecords';
  }
}
