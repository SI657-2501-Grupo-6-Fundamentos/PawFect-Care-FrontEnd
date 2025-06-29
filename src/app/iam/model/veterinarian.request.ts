import {VeterinarianSpeciality} from "./sign-up-vet.request";

export class VeterinarianRequest {
  public userId: number;
  public fullName: string;
  public phoneNumber: string;
  public email: string;
  public dni: string;
  public speciality: string;
  public availableStartTime: string;
  public availableEndTime: string;

  constructor(
    userId: number,
    fullName: string,
    phoneNumber: string,
    email: string,
    dni: string,
    speciality: string,
    availableStartTime: string,
    availableEndTime: string
  ) {
    this.userId = userId;
    this.fullName = fullName;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.dni = dni;
    this.speciality = speciality;
    this.availableStartTime = availableStartTime;
    this.availableEndTime = availableEndTime;
  }
}
