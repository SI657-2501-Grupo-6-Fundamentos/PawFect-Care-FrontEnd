import { Injectable } from '@angular/core';
import { Client } from '../model/client.entity';
import { BaseService } from '../../shared/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class ClientsService extends BaseService<Client> {
  constructor() {
    super();
    this.resourceEndPoint = 'client-service/api/v1/owners';
  }
}


