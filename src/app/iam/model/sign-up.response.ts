import { UserRole } from './sign-up.request';

/**
 * Model for the response of the sign-up endpoint
 */
export class SignUpResponse {
  public id: number;
  public username: string;
  public roles: UserRole[];

  /**
   * Constructor for SignUpResponse
   * @param id The id
   * @param username The username
   * @param roles The roles
   */
  constructor(id: number, username: string, roles: UserRole[]) {
    this.id = id;
    this.username = username;
    this.roles = roles;
  }
}
