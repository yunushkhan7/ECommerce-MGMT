import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/service/data.service';
import { AuthService } from 'src/app/service/auth.service';
import { CommonFunction, PasswordValidation } from 'src/app/shared/common';
import { UserService } from 'src/app/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router,ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']

})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  formErrors = {
    error: null,
    success: null,
  };
  showLoader = false;
  forgatAuth: any;
  token:any
  isLoding=false
  constructor(
    private router: Router,
    private authService: UserService,
    private dataService: DataService,
    private fBuilder: FormBuilder,
    private toastrService: ToastrService,
    public _activatedRoute:ActivatedRoute
  ) {
     this.showLoader=true
      this._activatedRoute.params.subscribe(parameter => {
      this.token = parameter['token']
      this.showLoader=false
    })

    this.resetPasswordForm = this.fBuilder.group({
      new_password: [null, Validators.compose([Validators.required, Validators.minLength(6)])], // validatePassword
      confirm_password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
    }, {
      validator: PasswordValidation.passwordValidation()
    });
    this.dataService.forgatAuth.subscribe((response) => {
      if (response) {
        this.forgatAuth = response;
      }
      //  else {
      //  / this.router.navigateByUrl('/forgot-password')
      // }
    });
  }

  ngOnInit() { }

  submitForm(): void {
    if (this.resetPasswordForm.valid) {
      this.showLoader = true;
      const formData = {
        // tenantCode: this.forgatAuth.tenantCode,
        //emailId: this.forgatAuth['emailId'],
        password: this.resetPasswordForm.value.confirm_password,
        confirmPassword: this.resetPasswordForm.value.confirm_password,
      };
      this.authService.resetPassword(formData,this.token).subscribe((response) => {

        if (response && response.success) {
          this.toastrService.success(response.message);
          this.formErrors.success = `* ${response.message}`;
          this.router.navigateByUrl('/login');
          this.showLoader = false;
          setTimeout(() => { CommonFunction.resetForm(this.resetPasswordForm); }, 1000);
        } else {
          this.toastrService.success(response.status);
          this.formErrors.error = `* ${response.error}`;
          this.showLoader = false;
        }
      }, (error) => {
        this.formErrors.error = `* ${error.error}`;
        this.showLoader = false;
        // this.toastrService.success(error.error.message);
        this.router.navigateByUrl('/login');
      });
    }
  }

}
