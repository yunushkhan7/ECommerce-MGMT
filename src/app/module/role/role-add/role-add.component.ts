import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { RoleService } from 'src/app/service/role.service';
import { DataService } from 'src/app/service/data.service';
import { keyPressAddress, keyPressAlpha } from 'src/app/shared/common';
import { AuthService } from 'src/app/service/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@AutoUnsubscribe()
@Component({
  selector: 'app-role-add',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.scss']
})
export class RoleAddComponent implements OnInit {

  loadingState = false;
  addForm: FormGroup;
  showLoader = false;
  formErrors = {
    email: null,
    apierror: null,
  };
  isEditing = false;
  editId = null;
  currentUser: any;
  currentTenant: any;
  moduleList: any = [];
  moduleIds: any = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private roleService: RoleService,
    private dataService: DataService,
    private authService: AuthService,
    private translateService:TranslateService,
    private toastr: ToastrService,
  ) {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) { this.getEditObject(); }
    }

    this.addForm = this.fb.group({
      name: ["", Validators.compose([Validators.required])],
      description: ["", Validators.compose([Validators.required])],
    });

    this.dataService.currentUser.subscribe((user) => { if (user) this.currentUser = user; });
  }

  ngOnInit() {
    this.getModules();
  }

  getModules() {
    this.showLoader = true;
    this.authService.getModulesList().subscribe((res: any) => {
      this.showLoader = false;
      this.moduleList = res.data;
      this.moduleList.forEach(e => {
        e.isChecked = false;
        e.operations.forEach(e2 => {
          e2.isChecked = false;
        });
      });
    })
  }

  getEditObject() {
    this.showLoader = true;
    this.roleService.getRoleById(this.editId).subscribe((response) => {
      if (response) {
        this.showLoader = false;
        this.addForm.patchValue(response?.data);
        const allEqual = arr => arr.every(v => v.isChecked === arr[0].isChecked)
        setTimeout(() => {
          this.moduleList.forEach(a => {
            a.operations.forEach(x => {
              response.data.moduleIds.forEach(y => {
                if (x._id == y?._id) {
                  x.isChecked = true;
                  this.moduleIds.push(y?._id)
                }
                if (x.isChecked) {
                  let n = allEqual(a.operations);
                  a.isChecked = n;
                }
              });
            });
          });
        }, 500);
      } else {
        this.router.navigateByUrl('/role');
      }
    });
  }

  onChildCheckbox(event, permission, item) {
    const allEqual = arr => arr.every(v => v.isChecked === arr[0].isChecked)
    const index = this.moduleIds.indexOf(permission?._id)
    permission.isChecked = event.checked
    if (event.checked)
      this.moduleIds.push(permission?._id);
    else
      this.moduleIds.splice(index, 1)
    item.operations.forEach(element => {
      if (element.isChecked)
        item.isChecked = allEqual(item?.operations);
    });
    this.moduleIds = [...new Set(this.moduleIds)];
  }

  onParentCheckbox(event, item) {
    item.isChecked = event.checked
    if (item.isChecked) {
      this.moduleIds.forEach(a => {
        item.operations.forEach(b => {
          if (a == b._id) {
            const index = this.moduleIds.indexOf(a)
            this.moduleIds.splice(index, 1)
          }
        });
      });
      item.operations.forEach(e => {
        e.isChecked = true;
        this.moduleIds.push(e._id);
      });
    } else {
      item.operations.forEach((e) => {
        const index = this.moduleIds.indexOf(e._id)
        e.isChecked = false;
        this.moduleIds.splice(index, 1)
      });
    }
    this.moduleIds = [...new Set(this.moduleIds)];
  }

  submitForm() {
    if (this.addForm.valid) {
      this.showLoader = true;
      const payload = {
        name: this.addForm.value?.name,
        description:this.addForm.value?.description,
        moduleIds:this.moduleIds
    }
      if (this.isEditing) {
        this.roleService.roleUpdate(this.editId,payload).subscribe((response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/role');
          } else { }
        }, (error) => {
          this.showLoader = false;
        });
      } else {
        this.roleService.saveRole(payload).subscribe((response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/role');
          } else{ }
        }, (error) => {
          this.toastr.error(this.translateService.instant('Role name exists already!'));
          this.showLoader = false; 
        });
      }
    }
  }

  validateText(event: any) { keyPressAlpha(event) }
  validateAddress(event: any) { keyPressAddress(event) }
  ngOnDestroy(): void { }
}
