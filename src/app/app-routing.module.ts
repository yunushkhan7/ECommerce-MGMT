import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginRedirect, EnsureAuthenticated } from './service/_guards';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./module/master.module').then(m => m.MasterModule),
    canActivate: [EnsureAuthenticated],
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule),
    canActivate: [LoginRedirect],
    data: { title: 'Login' },
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
    canActivate: [LoginRedirect],
    data: { title: 'forgot-password' },
  },
  {
    path: 'reset-password/:token',
    loadChildren: () => import('./auth/reset-password/reset-password.module').then(m => m.ResetPasswordModule),
    canActivate: [LoginRedirect],
    data: { title: 'reset-password' },
  },
  {
    path: 'verification',
    loadChildren: () => import('./auth/verify-opt/verify-opt.module').then(m => m.VerifyOptModule),
    canActivate: [LoginRedirect],
    data: { title: 'link-expired' },
  },
  {
    path: '404',
    loadChildren: () => import('./module/not-found/not-found.module').then((m) => m.NotfoundModule),
  },
  { path: '**', redirectTo: '/404', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
