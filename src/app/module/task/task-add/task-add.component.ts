import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DataService } from 'src/app/service/data.service';
import { keyPressAddress, keyPressAlpha } from 'src/app/shared/common';
import { AuthService } from 'src/app/service/auth.service';
import { TaskService } from 'src/app/service/task.service';
@AutoUnsubscribe()

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.scss']
})
export class TaskAddComponent implements OnInit {

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
  taskTypeList = [
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
    private taskService: TaskService,
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
      name: [null, Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      taskType: ['', Validators.compose([])],
      isActive: ['1', Validators.compose([])],
    });
    this.dataService.currentUser.subscribe((user) => {
      if (user) this.currentUser = user;
    });
  }

  ngOnInit() {
    // this.getModules();
  }

  getEditObject() {
    this.taskService.GetTaskById(this.editId).subscribe((response) => {
      if (response) {
        this.showLoader = false;
        this.addForm.patchValue(response.data);
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
        if (response.data.inactivemoduleIds.length != 0) {
          this.showInactive = true;
          const allEqual = (arr) =>
            arr.every((v) => v.isChecked === arr[0].isChecked);
          setTimeout(() => {
            this.inactiveModuleList.forEach((a) => {
              a.operation.forEach((x) => {
                response.data.inactivemoduleIds.forEach((y) => {
                  if (x.id == y) {
                    x.isChecked = true;
                    this.inactivemoduleIds.push(y);
                  }
                  if (x.isChecked) {
                    let n = allEqual(a.operation);
                    a.isChecked = n;
                  }
                });
              });
            });
          }, 500);
        }
        if (response.data.expiredmoduleIds.length != 0) {
          this.showExpire = true;
          const allEqual = (arr) =>
            arr.every((v) => v.isChecked === arr[0].isChecked);
          setTimeout(() => {
            this.expireModuleList.forEach((a) => {
              a.operation.forEach((x) => {
                response.data.expiredmoduleIds.forEach((y) => {
                  if (x.id == y) {
                    x.isChecked = true;
                    this.expiremoduleIds.push(y);
                  }
                  if (x.isChecked) {
                    let n = allEqual(a.operation);
                    a.isChecked = n;
                  }
                });
              });
            });
          }, 500);
        }
      } else {
        this.router.navigateByUrl('/task');
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
      this.showLoader = true;
      if (this.isEditing) {
        this.taskService.updateTask(this.editId,this.addForm.value).subscribe(
          (response) => {
            this.showLoader = false;
            if (response) {
              this.router.navigateByUrl('/task');
            } else {
            }
          },
          (error) => {
            this.showLoader = false;
          }
        );
      } else {
        this.taskService.saveTask(this.addForm.value).subscribe(
          (response) => {
            this.showLoader = false;
            if (response) {
              this.router.navigateByUrl('/task');
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
