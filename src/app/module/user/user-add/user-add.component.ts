import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { UserService } from 'src/app/service/user.service';
import { DataService } from 'src/app/service/data.service';
import { emailRegEx, keyPressAddress, keyPressAlpha } from 'src/app/shared/common';
import { ToastrService } from 'ngx-toastr';
import { RoleService } from 'src/app/service/role.service';
import { CommonService } from 'src/app/service/common.service';
import { environment } from 'src/environments/environment';
@AutoUnsubscribe()
@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {

  hide = true;
  loadingState = false;
  addForm: FormGroup;
  showLoader = false;
  formErrors = {
    email: null,
    apierror: null,
  };
  isEditing = false;
  editId = null;
  selectedBUCode: any;
  currentUser: any;
  currentTenant: any;
  selectedProfileFile: any;
  selectedroleList: Array<any> = [];
  roleList:any
  selectedFile: any;
  url: any;
  base64textString:any;
  roleLists: any = [
    {
      roleName:"admin",
      roleId:"admin",
    },
    {
      roleName:"admin User",
      roleId:"adminUser",
    },
    {
      roleName:"Company Admin",
      roleId:"companyAdmin",
    },
    {
      roleName:"Company User",
      roleId:"companyUser",
    }
  ];
  currentPage: any = 1;
  currentPageLimit = environment.defaultPageLimit;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private dataService: DataService,
    private toastService: ToastrService,
    private roleService: RoleService,
    private commonService: CommonService
  ) {
    this.selectedroleList = []
    this.getAllRoles()
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) {
        this.getEditObject(); }
    }

    this.addForm = this.fb.group({
      firstName: ["", Validators.compose([Validators.required])],
      lastName: ["", Validators.compose([Validators.required])],
      username:["", Validators.compose([Validators.required])],
      email: [null, [Validators.required, Validators.pattern(emailRegEx)]],
      language:["english", Validators.compose([Validators.required])],
      phoneNumber:["", Validators.compose([Validators.required])],
      role: ["", Validators.compose([Validators.required])],
      profilePicture:[null],

    });

    this.dataService.currentUser.subscribe((user) => { if (user) this.currentUser = user; });
  }

  ngOnInit() {

  }

  getAllRoles() {
    this.roleService.getRoleList(false,this.currentPage,this.currentPageLimit).subscribe((response: any) => {
      this.roleList = response?.data;
    })
  }

  getEditObject() {
    this.userService.getUserById(this.editId).subscribe((response) => {
      if (response) {
        console.log("res==>",response)
        this.selectedroleList = response?.data?.roleId?._id;
         this.addForm.patchValue({
          firstName:response?.data.firstName,
          lastName:response?.data?.lastName,
          username:response?.data?.username,
          email:response?.data?.email,
          language:response?.data.language,
          phoneNumber:response?.data?.phoneNumber,
          role:this.selectedroleList,
         })
      }
      else {
        this.router.navigateByUrl('/user');
      }
    });
  }


  fileChangeEvent(fileInput: any) {
    const reg = /(.*?)\.(jpg|jpeg|png|gif|giff)$/;
    if (!fileInput.target.files[0].name.match(reg)) {
      // this.toastService.showError(
      //   this.translateService.instant('ADMIN.SELECT')
      // );
      this.removeFile();
      return false;
    } else {
      this.removeFile();
      this.selectedProfileFile = null;
     this.selectedProfileFile = fileInput.target.files[0];
      this.selectedFile = fileInput.target.files[0];
      var reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.selectedFile);
    }
  }
  removeFile() {
    this.selectedFile = null;
  }
  handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = 'data:image/png;base64,' + btoa(binaryString);
  }


  async submitForm() {
    if (this.addForm.valid) {
      const payload={
        firstName:this.addForm.value?.firstName,
        lastName:this.addForm.value?.lastName,
        username:this.addForm.value?.username,
        email:this.addForm.value?.email,
        language:this.addForm.value?.language,
        phoneNumber:this.addForm.value?.phoneNumber,
        roleId:this.selectedroleList,
      }
      this.showLoader = true;
      // if (this.selectedProfileFile) {
      //   const data = new FormData(); data.append('file', this.selectedProfileFile);
      //   await this.commonService.fileUpload(data).then((res: any) => { this.addForm.get('profilePicture').setValue(res.data); })
      // }
      if (this.isEditing) {
        payload['image']={
          imageBase64:this.base64textString
        }
        this.userService.updateUser( payload, this.editId).subscribe((response) => {
          if (response) {
            this.showLoader = false;
            this.router.navigateByUrl('/user');
          } else { }
        }, (error) => {
          this.showLoader = false;
        });
      } else {
        this.userService.saveUser(payload).subscribe((response) => {
          if (response) {
            this.showLoader = false;
            this.router.navigateByUrl('/user');
          } else { }
        }, (error) => {
          this.showLoader = false;
        });
      }
    }
  }

  validateText(event: any) { keyPressAlpha(event) }
  validateAddress(event: any) { keyPressAddress(event) }
  ngOnDestroy(): void { }
}
