export class Review {
  id: number;
  rating: number;
  content: String;
  medicalAppointmentId: number;


  constructor(id: number, rating: number, content: String, medicalAppointmentId: number) {
    this.id = id;
    this.rating = rating;
    this.content = content;
    this.medicalAppointmentId = medicalAppointmentId;
  }
}
