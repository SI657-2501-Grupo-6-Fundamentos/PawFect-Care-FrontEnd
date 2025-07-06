import {Injectable} from "@angular/core";
import {BaseService} from "../../shared/services/base.service";
import {Diagnostic} from "../model/diagnostic.entity";

@Injectable({
  providedIn: 'root'
})
export class DiagnosticService extends BaseService<Diagnostic> {
  constructor() {
    super();
    this.resourceEndPoint = '/diagnostic-service/api/v1/diagnostics';
  }
}
