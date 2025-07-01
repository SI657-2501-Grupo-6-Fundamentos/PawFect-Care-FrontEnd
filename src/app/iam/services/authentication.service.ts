import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import {SignUpRequest} from "../model/sign-up.request";
import {SignUpResponse} from "../model/sign-up.response";
import {SignInRequest} from "../model/sign-in.request";
import {SignInResponse} from "../model/sign-in.response";
import { environments } from '../../../environments/environment.development';
import {SignUpAdminRequest} from "../model/sign-up-admin.request";
import {SignUpAdminResponse} from "../model/sign-up-admin.response";
import {GoogleSignInRequest} from "../model/google-sign-in.request";

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
    this.http.post<SignUpResponse>(`${this.basePath}/iam-service/api/v1/authentication/sign-up`, signUpRequest, this.httpOptions)
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
          console.error('Error signing up in iam-service', error);
          this.router.navigate(['/sign-up']).then();
        }
      });
  }

  signUpAdmin(signUpAdminRequest: SignUpAdminRequest) {
    return this.http.post<SignUpAdminResponse>(`${this.basePath}/iam-service/api/v1/authentication/sign-up-admin`, signUpAdminRequest, this.httpOptions)
      .subscribe({
        next: (accountResponse) => {
          console.log(`Signed up as ${accountResponse.userName} with id ${accountResponse.id}`);

          const vetRequest = {
            userId: accountResponse.id,
            fullName: accountResponse.fullName,
            phoneNumber: accountResponse.phoneNumber,
            email: accountResponse.email,
            dni: accountResponse.dni,
            speciality: signUpAdminRequest.speciality,
            availableStartTime: signUpAdminRequest.availableStartTime,
            availableEndTime: signUpAdminRequest.availableEndTime
          };

          this.http.post(`${this.basePath}/veterinarian-service/api/v1/veterinarians`, vetRequest, this.httpOptions)
            .subscribe({
              next: () => {
                console.log('Veterinary registered successfully');
                this.router.navigate(['/sign-in']).then();
              },
              error: (error) => {
                console.error('Error registering veterinary', error);
                this.router.navigate(['/sign-up-admin']).then();
              }
            });
        },

        error: (error) => {
          console.error('Error signing up in iam-service', error);
          this.router.navigate(['/sign-up-admin']).then();
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
    return this.http.post<SignInResponse>(`${this.basePath}/iam-service/api/v1/authentication/sign-in`, signInRequest, this.httpOptions)
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
   * Signs in a user with Google
   * <p>
   *   This method sends a Google sign-in request to the server.
   *   If the request is successful, the user is signed in and redirected to the home page.
   *   If the request fails, an error message is logged and the user stays on the sign-in page.
   * </p>
   * @param googleToken The Google ID token
   */
  signInWithGoogle(googleToken: string): void {
    const googleSignInRequest = new GoogleSignInRequest(googleToken);

    this.http.post<SignInResponse>(
      `${this.basePath}/iam-service/api/v1/auth/google/sign-in`,
      googleSignInRequest,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true // ⬅️ Esto es clave para cookies o sesiones si las usas
      }
    ).subscribe({
      next: (response) => {
        this.signedIn.next(true);
        this.signedInUserId.next(response.id);
        this.signedInUserName.next(response.userName);
        localStorage.setItem('token', response.token);
        console.log(`Signed in with Google as ${response.userName} with token ${response.token}`);
        this.router.navigate(['/']).then();
      },
      error: (error) => {
        console.error('Error signing in with Google', error);
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
