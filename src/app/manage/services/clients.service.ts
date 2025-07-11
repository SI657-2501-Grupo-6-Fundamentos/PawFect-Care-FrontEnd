import { Injectable } from '@angular/core';
import { Client } from '../model/client.entity';
import { BaseService } from '../../shared/services/base.service';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ClientsService extends BaseService<Client> {
  constructor() {
    super();
    this.resourceEndPoint = '/pet-owner-service/api/v1/pet-owners';
  }

  getOwnerById(ownerId: number): Observable<Client> {
    const url = `${this.basePath}${this.resourceEndPoint}/${ownerId}`;
    return this.http.get<Client>(url, this.httpOptions);
  }
}
