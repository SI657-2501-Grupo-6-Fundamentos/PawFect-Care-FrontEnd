import {Injectable} from "@angular/core";
import {BaseService} from "../../shared/services/base.service";
import {Schedule} from "../model/schedule.entity";

@Injectable({
  providedIn: 'root'
})
export class ScheduleService extends BaseService<Schedule> {
  constructor() {
    super();
    this.resourceEndPoint = '/schedule-service/api/v1/schedules';
  }
}
