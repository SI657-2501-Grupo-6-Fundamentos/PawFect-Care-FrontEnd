import {Injectable} from "@angular/core";
import {BaseService} from "../../shared/services/base.service";
import {Review} from "../model/review.entity";
import {map, Observable} from "rxjs";
import {Pet} from "../model/pet.entity";

@Injectable({
  providedIn: 'root'
})
export class ReviewService extends BaseService<Review>{
  constructor() {
    super();
    this.resourceEndPoint = '/feedback-service/api/v1/reviews';
  }

  /*public getAllReviewsByMedicalAppointmentId(medicalAppointmentId: number): Observable<Review[]> {
    const url = `${this.basePath}/feedback-service/api/v1/reviews/${medicalAppointmentId}`;
    return this.http.get<Review[]>(url, this.httpOptions);
  }*/


  public getAllReviewsByMedicalAppointmentId(medicalAppointmentId: number): Observable<Review[]> {
    const url = `${this.basePath}/feedback-service/api/v1/reviews/by-appointment/${medicalAppointmentId}`;
    return this.http.get<Review[]>(url, this.httpOptions);
  }
}
