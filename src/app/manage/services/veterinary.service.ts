import {Injectable} from "@angular/core";
import {BaseService} from "../../shared/services/base.service";
import {Veterinary} from "../model/veterinary.entity";

@Injectable({
  providedIn: 'root'
})
export class VeterinaryService extends BaseService<Veterinary> {
  constructor() {
    super();
    this.resourceEndPoint = '/veterinary-service/api/v1/veterinarians';
  }
}
