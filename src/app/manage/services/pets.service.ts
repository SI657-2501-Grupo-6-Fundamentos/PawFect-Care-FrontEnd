import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Pet } from '../model/pet.entity';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetsService extends BaseService<Pet>{
  constructor() {
    super();
    this.resourceEndPoint = 'pet-service/api/v1/pets';
  }
  public getPetsByOwnerId(ownerId: number): Observable<Pet[]> {
    const url = `${this.basePath}pet-service/api/v1/owners/${ownerId}/pets`;
    return this.http.get<Pet[]>(url, this.httpOptions);
  }
}
