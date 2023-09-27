import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { validateEmailFormControl } from 'src/app/shared/common';
import { DataService } from 'src/app/service/data.service';
import { ToastrService } from 'ngx-toastr';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponentPopup } from 'src/app/core/change-password-popup/change-password-popup.component';
@AutoUnsubscribe()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  formErrors = {
    apierror: null
  };
  showLoader = false;
  isAuthenticated: boolean;
  isCompanySelected: boolean;

  captchaValue: string = '';
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private fBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: DataService,
    public dialog: MatDialog,
  ) {
    this.loginForm = this.fBuilder.group({
      emailId: ['renu@asztechnologies.com', Validators.compose([Validators.required, validateEmailFormControl])],
      password: ['Pass@1234', Validators.compose([Validators.required])],
      captcha: [null, Validators.compose([Validators.required])],
      reCaptcha: ['']
    });

  }

  ngOnInit() {
    this.createCaptcha();
  }

  submitForm(): void {
    if (this.formErrors.apierror) {
      if (this.loginForm.controls['captcha'].value !== this.loginForm.controls['reCaptcha'].value) {
        this.createCaptcha();
        this.toastr.error('Please enter a valid captcha!!');
        return;
      }
    }
    if (this.loginForm.valid) {
      this.showLoader = true;
      const formData = {
        email: this.loginForm.value.emailId,
        password: this.loginForm.value.password,
      };
      this.authService.login(formData).subscribe((response) => {
        this.showLoader = false;
        if (response) {
          if (response?.data?.permissions && response?.data.permissions.length) {
            this.dataService.setAuth(response);
            this.activatedRoute.snapshot.queryParamMap.get('next');
            const nextURL = this.activatedRoute.snapshot.queryParamMap.get('next') ?
              this.activatedRoute.snapshot.queryParamMap.get('next') : '/dashboard';
            this.router.navigateByUrl(nextURL);

            if (response?.data?.user?.isFirstTimeLogin) {
              const dialogRef = this.dialog.open(ChangePasswordComponentPopup, {
                disableClose: true,
                // width: '683px',
                // height: '554px',
                data: response,
                panelClass: 'delete-popup'

              });

              dialogRef.afterClosed().subscribe(result => {
                if (result && result.is_delete) {
                  // ChangePasswordComponentPopup close action callback
                }
              });
            }
          }
          // if (response) {
          //   this.dataService.setAuth(response?.data);
          //   this.activatedRoute.snapshot.queryParamMap.get('next');
          //   const nextURL = this.activatedRoute.snapshot.queryParamMap.get('next') ?
          //     this.activatedRoute.snapshot.queryParamMap.get('next') : '/dashboard';
          //   this.router.navigateByUrl(nextURL);

          //   if (response?.user?.isFirstTimeLogin) {
          //     const dialogRef = this.dialog.open(ChangePasswordComponentPopup, {
          //       disableClose: true,
          //       // width: '683px',
          //       // height: '554px',
          //       data: response,
          //       panelClass: 'delete-popup'

          //     });

          //     dialogRef.afterClosed().subscribe(result => {
          //       if (result && result.is_delete) {
          //         // ChangePasswordComponentPopup close action callback
          //       }
          //     });
          //   }
          // }
          else {
            this.toastr.warning('please contact to administration.', 'Permission Denied');
          }
        } else {
          this.formErrors.apierror = `* ${response.error[0]}`;
        }
      }, (error) => {
        this.createCaptcha();
        this.toastr.error(error.error.message);
        this.formErrors.apierror = error.error.message;
        this.showLoader = false;
        this.loginForm.get('reCaptcha').setValidators(Validators.compose([Validators.required]));
        this.loginForm.get('reCaptcha').updateValueAndValidity();
      });
    }
  }

  removeError() {
    this.formErrors.apierror = null;
  }

  createCaptcha() {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    this.captchaValue = result;
    this.loginForm.controls['captcha'].setValue(result);
    this.loginForm.controls['reCaptcha'].setValue('');
  }

  ngOnDestroy(): void {

  }

}
