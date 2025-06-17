import { UserRole } from './sign-up.request';

/**
 * Model for the response of the sign-up endpoint
 */
export class SignUpResponse {
  public id: number;
  public email: string;
  public roles: UserRole[];

  /**
   * Constructor for SignUpResponse
   * @param id The id
   * @param email The email
   * @param roles The roles
   */
  constructor(id: number, email: string, roles: UserRole[]) {
    this.id = id;
    this.email = email;
    this.roles = roles;
  }
}
