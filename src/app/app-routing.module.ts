import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ApplicationListComponent } from './posts/application-list/application-list.component';
import { HomeComponent } from './home/home.component';
import { HouseListComponent } from './posts/house-list/house-list.component';
import { HouseApplyComponent } from './posts/house-apply/house-apply.component';
import { ApplicationStatusComponent } from './posts/application-status/application-status.component';

const routes: Routes = [
  {path: 'viewapplications', component: ApplicationStatusComponent},
  {path: 'applyhouse/:postId', component: HouseApplyComponent},
  {path: 'findhouses', component: HouseListComponent},
  {path: 'home', component: HomeComponent},
  {path: '', component: PostListComponent},
  {path: 'create', component: PostCreateComponent},
  {path: 'edit/:postId', component: PostCreateComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'view', component: ApplicationListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule{}
