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
   * @param googleTokenService
   */
  constructor(
    private router: Router,
    private http: HttpClient,
    private googleTokenService: GoogleTokenService
  ) {
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
   * Signs up a new user and a pet owner
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

  /**
   * Signs up a new user admin and a veterinarian
   * <p>
   *   This method sends a sign-up request to the server.
   *   If the request is successful, the user is redirected to the sign-in page.
   *   If the request fails, an error message is logged and the user is redirected to the sign-up page.
   *   The user is not signed in automatically after signing up.
   * </p>
   * @param signUpAdminRequest The {@link SignUpAdminRequest} object
   */
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

          this.http.post(`${this.basePath}/veterinary-service/api/v1/veterinarians`, vetRequest, this.httpOptions)
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
   * Signs as user admin with Google and create a veterinarian
   * <p>
   *   This method sends a Google sign-in request to the server.
   *   If the request is successful, the user admin account is created and signed in.
   *   Then a veterinarian profile is created and the user is redirected to the home page.
   *   If the request fails, an error message is logged and the user stays on the sign-in page.
   * </p>
   * @param googleToken The Google ID token
   */
  signInUserAdminWithGoogle(googleToken: string): void {
    // Decode the token to obtain the claims
    const claims = this.googleTokenService.decodeGoogleToken(googleToken);

    if (!claims) {
      console.error('Unable to decode Google token');
      return;
    }

    // Check if the token has expired
    if (this.googleTokenService.isTokenExpired(claims)) {
      console.error('Google token has expired');
      return;
    }

    console.log('Google token claims:', claims);


    const googleSignInUserAdminRequest = new GoogleSignInRequest(googleToken);

    this.http.post<SignInResponse>(
      `${this.basePath}/iam-service/api/v1/auth/google/sign-in-user-admin`,
      googleSignInUserAdminRequest,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true
      }
    ).subscribe({
      next: (response) => {
        console.log(`Signed in with Google as ${claims.name} with id ${response.id}`);

        // Create a Veterinary

        const now = new Date();
        const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0); // 9:00 AM
        const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0); // 5:00 PM

        const vetRequest = {
          userId: response.id,
          fullName: claims.name || `${claims.given_name} ${claims.family_name}`.trim(),
          phoneNumber: 'N/A',
          email: claims.email || '',
          dni: 'N/A',
          speciality: 'GENERAL MEDICINE', // Value
          availableStartTime: startTime.toISOString().slice(0, 19), // Format YYYY-MM-DDTHH:mm:ss
          availableEndTime: endTime.toISOString().slice(0, 19) // Format YYYY-MM-DDTHH:mm:ss
        };

        this.http.post(`${this.basePath}/veterinary-service/api/v1/veterinarians`, vetRequest, this.httpOptions)
          .subscribe({
            next: () => {
              console.log('Veterinary registered successfully');
              this.completeGoogleSignIn(response, claims.name);
            },
            error: (error) => {
              if (error.status === 409) {
                console.warn('Veterinarian already exists. Continuing login...');
                this.completeGoogleSignIn(response, claims.name);
              } else {
                console.error('Error registering veterinary', error);
                this.router.navigate(['/sign-in']).then();
              }
            }
          });

      },
      error: (error) => {
        console.error('Error signing in with Google', error);
      }
    });
  }

  /**
   * Signs in as user with Google and create a pet owner
   * <p>
   *   This method sends a Google sign-in request to the server.
   *   If the request is successful, the user account is created and signed in.
   *   Then a pet owner profile is created and the user is redirected to the home page.
   *   If the request fails, an error message is logged and the user stays on the sign-in page.
   * </p>
   * @param googleToken The Google ID token
   */
  signInUserWithGoogle(googleToken: string): void {
    // Decode the token to obtain the claims
    const claims = this.googleTokenService.decodeGoogleToken(googleToken);

    if (!claims) {
      console.error('Unable to decode Google token');
      return;
    }

    // Check if the token has expired
    if (this.googleTokenService.isTokenExpired(claims)) {
      console.error('Google token has expired');
      return;
    }
    console.log('Google token claims:', claims);


    const googleSignInUserRequest = new GoogleSignInRequest(googleToken);

    this.http.post<SignInResponse>(
      `${this.basePath}/iam-service/api/v1/auth/google/sign-in-user`,
      googleSignInUserRequest,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true
      }
    ).subscribe({
      next: (response) => {
        console.log(`Signed in with Google as ${claims.name} with id ${response.id}`);

        // Create a Pet Owner
        const petOwnerRequest = {
          userId: response.id,
          fullName: claims.name || `${claims.given_name} ${claims.family_name}`.trim(),
          phoneNumber: 'N/A',
          email: claims.email || '',
          address: 'N/A'
        };

        this.http.post(`${this.basePath}/pet-owner-service/api/v1/pet-owners`, petOwnerRequest, this.httpOptions)
          .subscribe({
            next: () => {
              console.log('Pet owner registered successfully');
              this.completeGoogleSignIn(response, claims.name);
            },
            error: (error) => {
              if (error.status === 409) {
                console.warn('Pet owner already exists. Continuing login...');
                this.completeGoogleSignIn(response, claims.name);
              } else {
                console.error('Error registering pet owner', error);
                this.router.navigate(['/sign-in']).then();
              }
            }
          });
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

  private completeGoogleSignIn(response: SignInResponse, name: string): void {
    this.signedIn.next(true);
    this.signedInUserId.next(response.id);
    this.signedInUserName.next(name);
    localStorage.setItem('token', response.token);
    console.log(`Authentication completed for ${name} with token ${response.token}`);
    this.router.navigate(['/']).then();
  }
}


/**
 * Google claims with user info
 */
export interface GoogleTokenClaims {
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  sub: string; // Google user ID
  aud: string; // audience
  exp: number; // expiration time
  iat: number; // issued at time
}

@Injectable({
  providedIn: 'root'
})
export class GoogleTokenService {

  /**
   * Decode a JWT Google token without verifying the signature
   * @param token Google's JWT token
   * @returns The claims of the decoded token
   */
  decodeGoogleToken(token: string): GoogleTokenClaims | null {
    try {
      // A JWT has 3 parts separated by periods: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid JWT format');
        return null;
      }

      // Decoding the payload (part two)
      const payload = parts[1];

      // Decode base64URL
      const decodedPayload = this.base64UrlDecode(payload);

      // Parse JSON
      const claims = JSON.parse(decodedPayload) as GoogleTokenClaims;

      return claims;
    } catch (error) {
      console.error('Error decoding Google token:', error);
      return null;
    }
  }

  /**
   * Decode a base64URL string
   * @param str The base64URL string to decode
   * @returns The decoded string
   */
  private base64UrlDecode(str: string): string {
    // Convert base64URL to standard base64
    str = str.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if necessary
    while (str.length % 4) {
      str += '=';
    }

    // Decode base64
    return decodeURIComponent(
      atob(str)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  }

  /**
   * Check if the token has expired
   * @param claims The token claims
   * @returns true if the token has expired
   */
  isTokenExpired(claims: GoogleTokenClaims): boolean {
    const now = Math.floor(Date.now() / 1000);
    return claims.exp < now;
  }
}
