/**
 * Model class for SignInRequest
 */
export class SignInRequest {
  public email: string;
  public password: string;

  /**
   * Constructor for SignInRequest
   * @param email The email
   * @param password The password
   */
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
