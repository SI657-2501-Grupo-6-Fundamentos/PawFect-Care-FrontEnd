import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './public/pages/page-not-found/page-not-found.component';
import { HomeComponent } from './public/pages/home/home.component';
import { PetsManagementComponent } from './manage/pages/pets-management/pets-management.component';
import { AppointmentsManagementComponent } from "./manage/pages/appointments-management/appointments-management.component";
import { ClientsManagementComponent } from './manage/pages/clients-management/clients-management.component';
import { AppointmentCreateComponent } from "./manage/components/appointment-create/appointment-create.component";
import { ClientCreateComponent } from './manage/components/client-create/client-create.component';
import { PetCreateComponent } from './manage/components/pet-create/pet-create.component';
import { PetEditComponent } from './manage/components/pet-edit/pet-edit.component';
import { ClientEditComponent } from './manage/components/client-edit/client-edit.component';
import { AppointmentEditComponent } from "./manage/components/appointment-edit/appointment-edit.component";
import { MedicalHistoryManagementComponent } from "./manage/pages/medicalHistory-management/medical-history-management.component";
import { SignInComponent } from './iam/pages/sign-in/sign-in.component';
import { SignUpComponent } from './iam/pages/sign-up/sign-up.component';
import { authenticationGuard } from './iam/services/authentication.guard';
import { ReviewsManagementComponent } from "./manage/pages/reviews-management/reviews-management.component";
import { ReviewEditComponent } from "./manage/components/review-edit/review-edit.component";
import { ReviewCreateComponent } from "./manage/components/review-create/review-create.component";
import { SignUpAdminComponent } from "./iam/pages/sign-up-admin/sign-up-admin.component";
import { RoleSelectionComponent } from "./iam/components/role-section/role-section.component";
import { TariffCreateComponent } from "./manage/components/tariff-create/tariff-create.component";
import { TariffManagementComponent } from "./manage/pages/tariff-management/tariff-management.component";
import { TariffEditComponent } from "./manage/components/tariff-edit/tariff-edit.component";
import { VeterinaryManagementComponent } from "./manage/pages/veterinary-management/veterinary-management.component";
import { ScheduleManagementComponent } from "./manage/pages/schedule-management/schedule-management.component";
import {RoleGuard} from "./iam/services/role.guard";
import {AccessDeniedComponent} from "./shared/components/access-denied.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },

  // Routes for veterinarians (UserAdmins)
  {
    path: 'manage/clients',
    component: ClientsManagementComponent,
    canActivate: [authenticationGuard, RoleGuard],
    data: { roles: ['veterinary', 'admin'] }
  },
  {
    path: 'manage/clients/add',
    component: ClientCreateComponent,
    canActivate: [authenticationGuard, RoleGuard],
    data: { roles: ['veterinary', 'admin'] }
  },
  {
    path: 'manage/veterinarians',
    component: VeterinaryManagementComponent,
    canActivate: [authenticationGuard, RoleGuard],
    data: { roles: ['veterinary', 'admin'] }
  },
  {
    path: 'manage/tariffs',
    component: TariffManagementComponent,
    canActivate: [authenticationGuard, RoleGuard],
    data: { roles: ['veterinary', 'admin'] }
  },

  // Routes for Pet Owners (Users)
  {
    path: 'manage/pets',
    component: PetsManagementComponent,
    canActivate: [authenticationGuard, RoleGuard],
    data: { roles: ['pet-owner', 'veterinary' ] }
  },
  {
    path: 'manage/appointments',
    component: AppointmentsManagementComponent,
    canActivate: [authenticationGuard, RoleGuard],
    data: { roles: ['pet-owner'] }
  },

  // Shared routes (ambos roles)
  {
    path: 'manage/medicalHistory/:id',
    component: MedicalHistoryManagementComponent,
    canActivate: [authenticationGuard, RoleGuard],
    data: { roles: ['pet-owner', 'veterinary', 'admin'] }
  },
  {
    path: 'manage/appointments/review/:id',
    component: ReviewsManagementComponent,
    canActivate: [authenticationGuard, RoleGuard],
    data: { roles: ['pet-owner', 'veterinary', 'admin'] }
  },

  // Public routes
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-up-admin', component: SignUpAdminComponent },
  { path: 'select-role', component: RoleSelectionComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: '**', component: PageNotFoundComponent },
];
