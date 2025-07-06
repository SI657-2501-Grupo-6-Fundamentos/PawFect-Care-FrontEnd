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
import { RoleSelectionComponent} from "./iam/components/role-section/role-section.component";

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'manage/medicalHistory/:id', component: MedicalHistoryManagementComponent, canActivate: [authenticationGuard] },
    { path: 'manage/pets', component: PetsManagementComponent, canActivate: [authenticationGuard] },
    { path: 'manage/pets/edit/:id', component: PetEditComponent, canActivate: [authenticationGuard] },
    { path: 'manage/clients/:id/add_pet', component: PetCreateComponent, canActivate: [authenticationGuard] },
    { path: 'manage/clients/add', component: ClientCreateComponent, canActivate: [authenticationGuard] },
    { path: 'manage/clients/edit/:id', component: ClientEditComponent, canActivate: [authenticationGuard] },
    { path: 'manage/clients', component: ClientsManagementComponent, canActivate: [authenticationGuard] },
    { path: 'manage/appointments', component: AppointmentsManagementComponent, canActivate: [authenticationGuard] },
    { path: 'manage/appointments/add', component: AppointmentCreateComponent, canActivate: [authenticationGuard] },
    { path: 'manage/appointments/edit/:id', component: AppointmentEditComponent, canActivate: [authenticationGuard] },
    { path: 'manage/appointments/review/:id', component: ReviewsManagementComponent, canActivate: [authenticationGuard] },
    { path: 'manage/appointments/add-review/:id', component: ReviewCreateComponent, canActivate: [authenticationGuard] },
    { path: 'manage/appointments/edit-review/:id', component: ReviewEditComponent, canActivate: [authenticationGuard] },
    { path: 'sign-in', component: SignInComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'sign-up-admin', component: SignUpAdminComponent },
    { path: 'select-role', component: RoleSelectionComponent },
    { path: '**', component: PageNotFoundComponent },
];
