import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { MedicalHistory } from '../model/medical-history.entity';

@Injectable({
  providedIn: 'root'
})
export class MedicalHistoryService  extends BaseService<MedicalHistory>{
  constructor() {
    super();
    this.resourceEndPoint = '/medicalHistory';
  }
}


