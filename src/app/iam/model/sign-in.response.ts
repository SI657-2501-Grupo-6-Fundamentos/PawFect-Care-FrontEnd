/**
 * Model class for sign-in response.
 */
export class SignInResponse {
  public id: number;
  public username: string;
  public token: string;

  /**
   * Constructor for SignInResponse
   * @param id The user id
   * @param username The username
   * @param token The generated token
   */
  constructor(id: number, username: string, token: string) {
    this.id = id;
    this.username = username;
    this.token = token;
  }
}
