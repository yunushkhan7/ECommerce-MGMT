import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DataService } from 'src/app/service/data.service';
import { keyPressAddress, keyPressAlpha } from 'src/app/shared/common';
import { AuthService } from 'src/app/service/auth.service';
import { ProductService } from 'src/app/service/product.service';
import { DeliveryPartnerService } from 'src/app/service/delivery-partner.service';
@AutoUnsubscribe()

@Component({
  selector: 'app-delivery-partner-add',
  templateUrl: './delivery-partner-add.component.html',
  styleUrls: ['./delivery-partner-add.component.scss']
})
export class DeliveryPartnerAddComponent implements OnInit {

  task: any;
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
  showInactive = false;
  showExpire = false;
  activeModuleList: any = [];
  inactiveModuleList: any = [];
  expireModuleList: any = [];
  activemoduleIds: any = [];
  inactivemoduleIds: any = [];
  expiremoduleIds: any = [];
  base64textString:any;
  selectedProfileFile: any;
  selectedFile: any;
  subCategoryList = [
    {
      name: 'Marketing'
    },
    {
      name: 'Analysis'
    }
  ];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private deliveryService: DeliveryPartnerService,
    private dataService: DataService,
    private authService: AuthService
  ) {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) {
        this.getEditObject();
      }
    }
    this.addForm = this.fb.group({

      name:['', Validators.compose([Validators.required])],
      chargesPriceRate:  [null, Validators.compose([Validators.required])],
      description:  ['', Validators.compose([Validators.required])],
      image:  [''],
    });
    this.dataService.currentUser.subscribe((user) => {
      if (user) this.currentUser = user;
    });
  }

  ngOnInit() {
   // this.getModules();
  }

  getEditObject() {
    this.deliveryService.GetDeliveryPartnerById(this.editId).subscribe((response) => {
      if (response) {
        this.showLoader = false;
        this.addForm.patchValue(response?.data);
        const allEqual = (arr) =>
          arr.every((v) => v.isChecked === arr[0].isChecked);
        setTimeout(() => {
          this.activeModuleList.forEach((a) => {
            a.operation.forEach((x) => {
              response.data.activemoduleIds.forEach((y) => {
                if (x.id == y) {
                  x.isChecked = true;
                  this.activemoduleIds.push(y);
                }
                if (x.isChecked) {
                  let n = allEqual(a.operation);
                  a.isChecked = n;
                }
              });
            });
          });
        }, 500);
        // if (response?.data?.inactivemoduleIds.length != 0) {
        //   this.showInactive = true;
        //   const allEqual = (arr) =>
        //     arr.every((v) => v.isChecked === arr[0].isChecked);
        //   setTimeout(() => {
        //     this.inactiveModuleList.forEach((a) => {
        //       a.operation.forEach((x) => {
        //         response.data.inactivemoduleIds.forEach((y) => {
        //           if (x.id == y) {
        //             x.isChecked = true;
        //             this.inactivemoduleIds.push(y);
        //           }
        //           if (x.isChecked) {
        //             let n = allEqual(a.operation);
        //             a.isChecked = n;
        //           }
        //         });
        //       });
        //     });
        //   }, 500);
        // }
        // if (response.data.expiredmoduleIds.length != 0) {
        //   this.showExpire = true;
        //   const allEqual = (arr) =>
        //     arr.every((v) => v.isChecked === arr[0].isChecked);
        //   setTimeout(() => {
        //     this.expireModuleList.forEach((a) => {
        //       a.operation.forEach((x) => {
        //         response.data.expiredmoduleIds.forEach((y) => {
        //           if (x.id == y) {
        //             x.isChecked = true;
        //             this.expiremoduleIds.push(y);
        //           }
        //           if (x.isChecked) {
        //             let n = allEqual(a.operation);
        //             a.isChecked = n;
        //           }
        //         });
        //       });
        //     });
        //   }, 500);
        // }
      } else {
        this.router.navigateByUrl('/delivery-partner');
      }
    });
  }

  getModules() {
    this.showLoader = true;
    this.authService.getModules({}).subscribe((res: any) => {
      this.showLoader = false;
      this.activeModuleList = res.data;
      this.myLogic(this.activeModuleList);
    });

    this.authService.getModules({}).subscribe((res: any) => {
      this.showLoader = false;
      this.inactiveModuleList = res.data;
      this.myLogic(this.inactiveModuleList);
    });

    this.authService.getModules({}).subscribe((res: any) => {
      this.showLoader = false;
      this.expireModuleList = res.data;
      this.myLogic(this.expireModuleList);
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
  myLogic(moduleList) {
    moduleList.forEach((e) => {
      e.isChecked = false;
      e.operation.forEach((e2) => {
        e2.isChecked = false;
      });
    });
  }

  onInactive(event) {
    if (event.checked) {
      this.showInactive = true;
    } else {
      this.showInactive = false;
      this.inactivemoduleIds = [];
      this.inactiveModuleList.forEach((a) => {
        if (a.isChecked) a.isChecked = false;
        a.operation.forEach((b) => {
          if (b.isChecked) b.isChecked = false;
        });
      });
    }
  }

  onExpired(event) {
    if (event.checked) {
      this.showExpire = true;
    } else {
      this.showExpire = false;
      this.expiremoduleIds = [];
      this.expireModuleList.forEach((a) => {
        if (a.isChecked) a.isChecked = false;
        a.operation.forEach((b) => {
          if (b.isChecked) b.isChecked = false;
        });
      });
    }
  }

  onChildCheckboxActive(event, permission, item) {
    const allEqual = (arr) =>
      arr.every((v) => v.isChecked === arr[0].isChecked);
    const index = this.activemoduleIds.indexOf(permission.id);
    permission.isChecked = event.checked;
    if (event.checked) this.activemoduleIds.push(permission.id);
    else this.activemoduleIds.splice(index, 1);
    item.operation.forEach((element) => {
      if (element.isChecked) item.isChecked = allEqual(item.operation);
    });
    this.activemoduleIds = [...new Set(this.activemoduleIds)];
  }

  onChildCheckboxInactive(event, permission, item) {
    const allEqual = (arr) =>
      arr.every((v) => v.isChecked === arr[0].isChecked);
    const index = this.inactivemoduleIds.indexOf(permission.id);
    permission.isChecked = event.checked;
    if (event.checked) this.inactivemoduleIds.push(permission.id);
    else this.inactivemoduleIds.splice(index, 1);
    item.operation.forEach((element) => {
      if (element.isChecked) item.isChecked = allEqual(item.operation);
    });
    this.inactivemoduleIds = [...new Set(this.inactivemoduleIds)];
  }

  onChildCheckboxExpire(event, permission, item) {
    const allEqual = (arr) =>
      arr.every((v) => v.isChecked === arr[0].isChecked);
    const index = this.expiremoduleIds.indexOf(permission.id);
    permission.isChecked = event.checked;
    if (event.checked) this.expiremoduleIds.push(permission.id);
    else this.expiremoduleIds.splice(index, 1);
    item.operation.forEach((element) => {
      if (element.isChecked) item.isChecked = allEqual(item.operation);
    });
    this.expiremoduleIds = [...new Set(this.expiremoduleIds)];
  }

  onParentCheckboxActive(event, item) {
    item.isChecked = event.checked;
    if (item.isChecked) {
      this.activemoduleIds.forEach((a) => {
        item.operation.forEach((b) => {
          if (a == b.id) {
            const index = this.activemoduleIds.indexOf(a);
            this.activemoduleIds.splice(index, 1);
          }
        });
      });
      item.operation.forEach((e) => {
        e.isChecked = true;
        this.activemoduleIds.push(e.id);
      });
    } else {
      item.operation.forEach((e) => {
        const index = this.activemoduleIds.indexOf(e.id);
        e.isChecked = false;
        this.activemoduleIds.splice(index, 1);
      });
    }
    this.activemoduleIds = [...new Set(this.activemoduleIds)];
  }

  onParentCheckboxInactive(event, item) {
    item.isChecked = event.checked;
    if (item.isChecked) {
      this.inactivemoduleIds.forEach((a) => {
        item.operation.forEach((b) => {
          if (a == b.id) {
            const index = this.inactivemoduleIds.indexOf(a);
            this.inactivemoduleIds.splice(index, 1);
          }
        });
      });
      item.operation.forEach((e) => {
        e.isChecked = true;
        this.inactivemoduleIds.push(e.id);
      });
    } else {
      item.operation.forEach((e) => {
        const index = this.inactivemoduleIds.indexOf(e.id);
        e.isChecked = false;
        this.inactivemoduleIds.splice(index, 1);
      });
    }
    this.inactivemoduleIds = [...new Set(this.inactivemoduleIds)];
  }

  onParentCheckboxExpire(event, item) {
    item.isChecked = event.checked;
    if (item.isChecked) {
      this.expiremoduleIds.forEach((a) => {
        item.operation.forEach((b) => {
          if (a == b.id) {
            const index = this.expiremoduleIds.indexOf(a);
            this.expiremoduleIds.splice(index, 1);
          }
        });
      });
      item.operation.forEach((e) => {
        e.isChecked = true;
        this.expiremoduleIds.push(e.id);
      });
    } else {
      item.operation.forEach((e) => {
        const index = this.expiremoduleIds.indexOf(e.id);
        e.isChecked = false;
        this.expiremoduleIds.splice(index, 1);
      });
    }
    this.expiremoduleIds = [...new Set(this.expiremoduleIds)];
  }

  submitForm() {
    if (this.addForm.valid) {
      // const params = {
      //   plan: {
      //     id: this.editId,
      //     ...this.addForm.value,
      //     is_inactive_module: this.showInactive,
      //     is_expire_module: this.showExpire,
      //   },
      //   activemoduleIds: this.activemoduleIds,
      //   inactivemoduleIds: this.inactivemoduleIds,
      //   expiredmoduleIds: this.expiremoduleIds,
      // };

      const params = {
        name: this.addForm.value?.name,
        chargesPriceRate: this.addForm.value?.chargesPriceRate,
        description: this.addForm.value?.description,
        image: this.base64textString

      };

      this.showLoader = true;
      if (this.isEditing) {
        this.deliveryService.updateDeliveryPartner(params,this.editId).subscribe(
          (response) => {
            this.showLoader = false;
            if (response) {
              this.router.navigateByUrl('/delivery-partner');
            } else {
            }
          },
          (error) => {
            this.showLoader = false;
          }
        );
      } else {
        this.deliveryService.saveDeliveryPartner(params).subscribe(
          (response) => {
            this.showLoader = false;
            if (response) {
              this.router.navigateByUrl('/delivery-partner');
            } else {
            }
          },
          (error) => {
            this.showLoader = false;
          }
        );
      }
    }
  }

  validateText(event: any) {
    keyPressAlpha(event);
  }
  validateAddress(event: any) {
    keyPressAddress(event);
  }
  ngOnDestroy(): void {}

}
