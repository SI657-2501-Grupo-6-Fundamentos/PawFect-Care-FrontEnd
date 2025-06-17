/**
 * Model class for sign-in response.
 */
export class SignInResponse {
  public id: number;
  public email: string;
  public token: string;

  /**
   * Constructor for SignInResponse
   * @param id The user id
   * @param email The email
   * @param token The generated token
   */
  constructor(id: number, email: string, token: string) {
    this.id = id;
    this.email = email;
    this.token = token;
  }
}
