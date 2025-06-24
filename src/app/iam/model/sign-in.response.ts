/**
 * Model class for sign-in response.
 */
export class SignInResponse {
  public id: number;
  public userName: string;
  public token: string;

  /**
   * Constructor for SignInResponse
   * @param id The user id
   * @param userName The userName
   * @param token The generated token
   */
  constructor(id: number, userName: string, token: string) {
    this.id = id;
    this.userName = userName;
    this.token = token;
  }
}
