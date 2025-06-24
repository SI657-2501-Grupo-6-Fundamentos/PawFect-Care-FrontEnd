/**
 * Model class for SignInRequest
 */
export class SignInRequest {
  public userName: string;
  public password: string;

  /**
   * Constructor for SignInRequest
   * @param userName The userName
   * @param password The password
   */
  constructor(userName: string, password: string) {
    this.userName = userName;
    this.password = password;
  }
}
