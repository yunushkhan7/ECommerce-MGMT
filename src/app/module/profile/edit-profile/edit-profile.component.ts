import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/service/common.service';
import { DataService } from 'src/app/service/data.service';
import { UserService } from 'src/app/service/user.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']

})
export class EditProfileComponent implements OnInit {

  showLoader = false;
  addForm: FormGroup;
  formErrors = {
    emailId: null,
    apierror: null,
  };
  isEditing = false;
  editId = null;
  pageTitle = 'Update Profile';
  currentUser: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private toastService: ToastrService,
    private dataService: DataService,
    private commonService: CommonService,
    private location: Location,
  ) {
    this.addForm = this.fb.group({
      emailId: [{ value: null, disabled: true }, Validators.compose([Validators.email])],
      firstName: [{ value: "", disabled: true }],
      lastName: [{ value: null, disabled: true }, Validators.compose([Validators.required])],
      nativeName: [{ value: "", disabled: true }],
      roleId: [null],
      password: [""],
      designation: [{ value: null, disabled: true }],
      primaryContact: [{ value: null, disabled: true }, Validators.compose([Validators.minLength(8), Validators.maxLength(20)])],
      profilePicture: [{ value: null, disabled: true }],

    });

    this.dataService.currentUser.subscribe((data) => {
      if (data) {
        this.currentUser = data;
        this.isEditing = true;
        this.editId = this.currentUser.id;
        this.getMasterData();

      }
    })
  }

  ngOnInit() { }

  getMasterData() { }

  getEditObject() {
    this.userService.getUserById({ id: this.editId }).subscribe((response) => {
      this.addForm.patchValue(response.data);
    });

  }

  async submitForm() {
    if (this.addForm.valid) {

      if (this.isEditing) {
        this.userService.saveUser({ ...this.addForm.value, id: this.editId, isActive: true }).subscribe((response) => {
          this.showLoader = false;
          if (response.status == 'Ok') {
            this.dataService.updateAuth({ ...this.currentUser, ...response.data });
            if (this.currentUser.userType == 'End User') {
              this.router.navigateByUrl('/my-cards');
            } else {
              this.location.back();
            }

          } else {
            this.toastService.error(response.message);
            response.error.map(obj => {
              if (obj.hasOwnProperty('emailId')) {
                this.formErrors['emailId'] = obj['emailId'];
              } else {
                this.formErrors['apierror'] = `* ${response.error}`;
              }
            });
          }
        }, (error) => {
          this.showLoader = false;
        });
      }
    }
  }

  // Image fields in attributes Array
  SelectedFile: any;
  selectedIndex: number = 0;
  async fileChangeEvent(fileInputFile: any, i) {
    this.selectedIndex = i;
    const reg = /(.*?)\.(jpg|jpeg|png|gif|giff)$/;
    if (!fileInputFile.target.files[0].name.match(reg)) {
      this.toastService.error('Please select valid file');
      this.removeFile();
      return false;
    } else {
      this.removeFile();
      this.SelectedFile = fileInputFile.target.files[0];
      // var reader = new FileReader();
      // reader.onload = this.HandleReaderLoadedFile.bind(this);
      // reader.readAsBinaryString(this.SelectedFile);
    }
  }
  removeFile() {
    this.SelectedFile = null;
  }

  verifyEmail() {
    this.formErrors['emailId'] = false;
    if (this.addForm.controls['emailId'].valid)
      this.userService.checkLoginIdExists({ emailId: this.addForm.value.emailId }).subscribe((res) => {
        if (res.message == 'Exist') {
          this.addForm.controls['emailId'].setErrors({ isExit: true });
          this.formErrors['emailId'] = 'Email already exit';
        } else {
          // this.addForm.controls['emailId'].setErrors(null);
          this.addForm.get('emailId').setValidators(Validators.compose([Validators.required, Validators.email]));
          this.addForm.get('emailId').updateValueAndValidity();
          this.formErrors['emailId'] = false;
        }
      })
  }

  ngOnDestroy(): void { }
}
