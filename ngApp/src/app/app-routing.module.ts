import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEmployeesComponent } from './add-emp/add-emp.component';
import { AuthGuard } from './auth.guard';
import { EditEmployeesComponent } from './edit-emp/edit-emp.component';
import { EmployeesDetailsComponent } from './emp-details/emp-details.component';
import { EmployeesComponent } from './emp/emp.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/emp',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'emp',
    component: EmployeesComponent,
    data: { title: 'List of Employees' },
  },
  {
    path: 'emp-details/:id',
    component: EmployeesDetailsComponent,
    data: { title: 'Employees Details' },
  },
  {
    path: 'add-emp',
    component: AddEmployeesComponent,
    data: { title: 'Add Employees' },
  },
  {
    path: 'edit-emp/:id',
    component: EditEmployeesComponent,
    data: { title: 'Edit Employees' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
