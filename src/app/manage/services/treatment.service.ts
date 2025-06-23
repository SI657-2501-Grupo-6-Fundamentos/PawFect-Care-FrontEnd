import { Injectable } from '@angular/core';
import {BaseService} from "../../shared/services/base.service";
import {Treatment} from "../model/treatment.entity";

@Injectable({
  providedIn: 'root'
})
export class TreatmentService extends BaseService<Treatment>{
  constructor() {
    super();
    this.resourceEndPoint = '/treatment-service/api/v1/treatments';
  }
}
