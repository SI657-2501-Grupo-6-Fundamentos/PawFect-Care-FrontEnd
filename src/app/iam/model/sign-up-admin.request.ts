import { UserRole } from './sign-up.request';

/**
 * Enum for veterinarian specialities
 */
export enum VeterinarianSpeciality {
  GENERAL_MEDICINE = 'GENERAL MEDICINE',
  VETERINARY_SURGERY = 'VETERINARY SURGERY',
  VETERINARY_PATHOLOGY = 'VETERINARY PATHOLOGY',
  VETERINARY_RADIOLOGY = 'VETERINARY RADIOLOGY',
  VETERINARY_NUTRITION = 'VETERINARY NUTRITION',
  VETERINARY_BEHAVIOR  = 'VETERINARY BEHAVIOR',
  VETERINARY_OPHTHALMOLOGY = 'VETERINARY OPHTHALMOLOGY',
  VETERINARY_DERMATOLOGY = 'VETERINARY DERMATOLOGY',
  VETERINARY_CARDIOLOGY = 'VETERINARY CARDIOLOGY',
  VETERINARY_ONCOLOGY = 'VETERINARY ONCOLOGY',
  VETERINARY_NEUROLOGY = 'VETERINARY NEUROLOGY',
  VETERINARY_ORTHOPEDICS = 'VETERINARY ORTHOPEDICS',
  VETERINARY_PHYSIOTHERAPY = 'VETERINARY PHYSIOTHERAPY',
  EMERGENCY_AND_CRITICAL_CARE = 'EMERGENCY AND CRITICAL CARE',
}

/**
 * Model for the response of the sign-up endpoint
 */
export class SignUpAdminRequest {
  public userName: string;
  public role: UserRole;
  public fullName: string;
  public phoneNumber: string;
  public email: string;
  public dni: string;
  public speciality: string;
  public availableStartTime: string;
  public availableEndTime: string;
  public password: string;

  /**
   * Constructor for SignUpResponse
   * @param userName The userName
   * @param role The user role
   * @param fullName The full name
   * @param phoneNumber The phone number
   * @param email The email
   * @param dni The DNI
   * @param speciality The speciality
   * @param availableStartTime The start time of availability
   * @param availableEndTime The end time of availability
   * @param password The password
   */
  constructor(
    userName: string,
    role: UserRole,
    fullName: string,
    phoneNumber: string,
    email: string,
    dni: string,
    speciality: string,
    availableStartTime: string,
    availableEndTime: string,
    password: string
  ) {
    this.userName = userName;
    this.role = UserRole.ADMIN; // Default role is ADMIN
    this.fullName = fullName;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.dni = dni;
    this.speciality = speciality;
    this.availableStartTime = availableStartTime;
    this.availableEndTime = availableEndTime;
    this.password = password;}
}
