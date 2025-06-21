import { Injectable } from '@angular/core';
import {BaseService} from "../../shared/services/base.service";
import {Appointment} from "../model/appointment.entity";

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService extends BaseService<Appointment> {

  constructor() {
    super();
    this.resourceEndPoint = '/appointment-service/api/v1/appointments';
  }
}
