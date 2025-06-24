import { UserRole } from './sign-up.request';

/**
 * Model for the response of the sign-up endpoint
 */
export class SignUpResponse {
  public id: number;
  public userName: string;
  public roles: UserRole;

  /**
   * Constructor for SignUpResponse
   * @param id The id
   * @param userName The userName
   * @param roles The roles
   */
  constructor(id: number, userName: string, roles: UserRole) {
    this.id = id;
    this.userName = userName;
    this.roles = UserRole.ADMIN;
  }
}
