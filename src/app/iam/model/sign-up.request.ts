/**
 * Enum for user roles
 */
export enum UserRole {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN',
}

/**
 * Model class for SignUpRequest
 */
export class SignUpRequest {
  public username: string;
  public password: string;
  public role: UserRole;

  /**
   * Constructor for SignUpRequest
   * @param username The username
   * @param password The password
   * @param role The user role
   */
  constructor(username: string, password: string, role: UserRole) {
    this.username = username;
    this.password = password;
    this.role = role;
  }
}
