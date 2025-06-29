import { UserRole } from './sign-up.request';

/**
 * Model for the response of the sign-up endpoint
 */
export class SignUpResponse {
  public id: number;
  public userName: string;
  public fullName: string;
  public phoneNumber: string;
  public email: string;
  public address: string;
  public role: UserRole;

  /**
   * Constructor for SignUpResponse
   * @param id The id
   * @param userName The userName
   * @param fullName The full name
   * @param phoneNumber The phone number
   * @param email The email
   * @param address The address
   * @param role The rol
   */
  constructor(id: number, userName: string, fullName: string, phoneNumber: string, email: string, address: string, role: UserRole) {
    this.id = id;
    this.userName = userName;
    this.fullName = fullName;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.address = address;
    this.role = role;
  }
}
