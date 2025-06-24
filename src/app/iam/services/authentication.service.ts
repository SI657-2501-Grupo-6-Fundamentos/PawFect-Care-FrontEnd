import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import {SignUpRequest} from "../model/sign-up.request";
import {SignUpResponse} from "../model/sign-up.response";
import {SignInRequest} from "../model/sign-in.request";
import {SignInResponse} from "../model/sign-in.response";
import { environments } from '../../../environments/environment.development';

/**
 * Authentication service
 * <p>
 *   This service is responsible for handling user authentication.
 *   It provides methods for signing up, signing in, and signing out.
 *   It also provides observables for the signed in state, the current user id, and the current username.
 * </p>
 */
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  basePath: string = `${environments.serverBasePath}`;
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  // states
  private signedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private signedInUserId: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private signedInUserName: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * Constructor
   * @param router the router
   * @param http the http client
   */
  constructor(private router: Router, private http: HttpClient) {
    const token = localStorage.getItem('token');
    console.log(token)
    if (token) {
      this.signedIn.next(true);
    } else {
      this.signedIn.next(false);
    }
  }

  /**
   * Validates if the user is signed in
   */
  get isSignedIn() {
    return this.signedIn.asObservable();
  }

  /**
   * Gets the current user id
   */
  get currentUserId() {
    return this.signedInUserId.asObservable();
  }

  /**
   * Gets the current username
   */
  get currentUserName() {
    return this.signedInUserName.asObservable();
  }

  // actions

  /**
   * Signs up a new user
   * <p>
   *   This method sends a sign-up request to the server.
   *   If the request is successful, the user is redirected to the sign-in page.
   *   If the request fails, an error message is logged and the user is redirected to the sign-up page.
   *   The user is not signed in automatically after signing up.
   * </p>
   * @param signUpRequest The {@link SignUpRequest} object
   */
  signUp(signUpRequest: SignUpRequest): void {
    this.http.post<SignUpResponse>(`${this.basePath}/account-service/api/auth/register`, signUpRequest, this.httpOptions)
      .subscribe({
        next: (accountResponse) => {
          console.log(`Signed up as ${accountResponse.userName} with id ${accountResponse.id}`);

          const petOwnerRequest = {
            userId: accountResponse.id,
            fullName: accountResponse.fullName,
            phoneNumber: accountResponse.phoneNumber,
            email: accountResponse.email,
            address: accountResponse.address
          };

          this.http.post(`${this.basePath}/pet-owner-service/api/v1/pet-owners`, petOwnerRequest, this.httpOptions)
            .subscribe({
              next: () => {
                console.log('Pet owner registered successfully');
                this.router.navigate(['/sign-in']).then();
              },
              error: (error) => {
                console.error('Error registering pet owner', error);
                this.router.navigate(['/sign-up']).then();
              }
            });
        },
        error: (error) => {
          console.error('Error signing up in account-service', error);
          this.router.navigate(['/sign-up']).then();
        }
      });
  }



  signUpVet(signUpRequest: SignUpRequest) {
    return this.http.post<SignUpResponse>(`${this.basePath}/account-service/api/auth/register-vet`, signUpRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          console.log(`Signed up as ${response.userName} with id ${response.id}`);
          this.router.navigate(['/sign-in']).then();
        },
        error: (error) => {
          console.error('Error signing up', error);
          this.router.navigate(['/sign-up-vet']).then();
        }
      });
  }

  /**
   * Signs in a user
   * <p>
   *   This method sends a sign-in request to the server.
   *   If the request is successful, the user is signed in and redirected to the home page.
   *   If the request fails, an error message is logged and the user is redirected to the sign-in page.
   * </p>
   * @param signInRequest The {@link SignInRequest} object
   */
  signIn(signInRequest: SignInRequest) {

    return this.http.post<SignInResponse>(`${this.basePath}/account-service/api/auth/login`, signInRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          this.signedIn.next(true);
          this.signedInUserId.next(response.id);
          this.signedInUserName.next(response.userName);
          localStorage.setItem('token', response.token);
          console.log(`Signed in as ${response.userName} with token ${response.token}`);
          this.router.navigate(['/']).then();
        },
        error: (error) => {
          console.error('Error signing in', error);
          this.router.navigate(['/sign-in']).then();
        }
      });
  }

  /**
   * Signs out the current user
   * <p>
   *   This method signs out the current user and redirects them to the sign-in page.
   * </p>
   */
  signOut() {
    this.signedIn.next(false);
    this.signedInUserId.next(0);
    this.signedInUserName.next('');
    localStorage.removeItem('token');
    this.router.navigate(['/sign-in']).then();
  }
}
