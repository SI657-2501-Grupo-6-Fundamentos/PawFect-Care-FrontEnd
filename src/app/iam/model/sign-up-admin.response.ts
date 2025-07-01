import { UserRole } from './sign-up.request';

/**
 * Model for the response of the sign-up-vet endpoint
 */
export class SignUpAdminResponse {
  public id: number;
  public userName: string;
  public fullName: string;
  public phoneNumber: string;
  public email: string;
  public dni: string;
  public speciality: string;
  public availableStartTime: string;
  public availableEndTime: string;
  public role: UserRole;

  /**
   * Constructor for SignUpAdminResponse
   * @param id The id
   * @param userName The userName
   * @param fullName The full name
   * @param phoneNumber The phone number
   * @param email The email
   * @param dni The DNI
   * @param speciality The speciality
   * @param availableStartTime The start time of availability
   * @param availableEndTime The end time of availability
   * @param role The user role
   */

  constructor(
    id: number,
    userName: string,
    fullName: string,
    phoneNumber: string,
    email: string,
    dni: string,
    speciality: string,
    availableStartTime: string,
    availableEndTime: string,
    role: UserRole
  ) {
    this.id = id;
    this.userName = userName;
    this.fullName = fullName;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.dni = dni;
    this.speciality = speciality;
    this.availableStartTime = availableStartTime;
    this.availableEndTime = availableEndTime;
    this.role = role;
  }
}
