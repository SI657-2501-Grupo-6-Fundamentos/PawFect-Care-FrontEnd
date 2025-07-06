import {Injectable} from "@angular/core";
import {BaseService} from "../../shared/services/base.service";
import {Tariff} from "../model/tariff.entity";

@Injectable({
  providedIn: 'root'
})
export class TariffService extends BaseService<Tariff> {
  constructor() {
    super();
    this.resourceEndPoint = '/appointment-service/api/v1/tariffs';
  }
}
