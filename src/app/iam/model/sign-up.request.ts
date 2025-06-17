/**
 * Enum for user roles
 */
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ROLE_ADMIN',
}

/**
 * Model class for SignUpRequest
 */
export class SignUpRequest {
  public email: string;
  public password: string;
  public role: UserRole;

  /**
   * Constructor for SignUpRequest
   * @param email The email
   * @param password The password
   * @param role The user role
   */
  constructor(email: string, password: string, role: UserRole) {
    this.email = email;
    this.password = password;
    this.role = role;
  }
}
