/**
 * Enum for user roles
 */
export enum UserRole {
  USER = 'ROLE_USER',
  ADMIN = 'ROLE_ADMIN',
}

/**
 * Model class for SignUpRequest
 */
export class SignUpRequest {
  public userName: string;
  public role: UserRole;
  public fullName: string;
  public phoneNumber: string;
  public email: string;
  public address: string;
  public password: string;

  /**
   * Constructor for SignUpRequest
   * @param userName The userName
   * @param role The user role
   * @param fullName The full name
   * @param phoneNumber The phone number
   * @param email The email
   * @param address The address
   * @param password The password
   */
  constructor(userName: string, role: UserRole, fullName: string, phoneNumber: string, email: string, address: string, password: string) {
    this.userName = userName;
    this.role = UserRole.USER; // Default role is USER
    this.fullName = fullName;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.address = address;
    this.password = password;
  }
}
