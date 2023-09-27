import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DataService } from 'src/app/service/data.service';
import { keyPressAddress, keyPressAlpha } from 'src/app/shared/common';
import { AuthService } from 'src/app/service/auth.service';
import { ProductService } from 'src/app/service/product.service';
import { ToastrService } from 'ngx-toastr';
import { ProductcategoryService } from 'src/app/service/productcategory.service';
import { CompanyService } from 'src/app/service/company.service';
import { VendorsSupplierService } from 'src/app/service/vendors-supplier.service';
@AutoUnsubscribe()

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {
  @ViewChild('attachments') attachment: any;
  fileList: File[] = [];
  listOfFiles: any[] = [];
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
  subCategoryList = [
    {
      name: 'Marketing'
    },
    {
      name: 'Analysis'
    }
  ];
  selectedProfileFile: any;
  CategoryList :any;
  selectedCategory:any
  selectedFile: any;
  url: any;
  base64textString:any;
  ArrayOfSelectedFile = new Array<string>();
  companyList=[]
  companyDataList:any;
  selectedCompany:[]
  selectedCompanyData:any
  purchaseimageList=[]
  selectedVendorData:any
  vendorList:any;
  selectedVendor:any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private productService: ProductService,
    private dataService: DataService,
    private authService: AuthService,
    private toastService: ToastrService,
    private productcategoryService: ProductcategoryService,
    private companyService: CompanyService,
    private vendorService: VendorsSupplierService
  ) {
  this.companyList = [];
    this.selectedCategory= [];
    this.getCategoryList();
    this.getCompanyList();
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) {
        this.getEditObject();
      }
    }
    this.addForm = this.fb.group({
      productName: [null, Validators.compose([Validators.required])],
      productDescription: ['', Validators.compose([Validators.required])],
      image:['', Validators.compose([])],
      productOtherImages: ['', Validators.compose([])],
      productSku: ['', Validators.compose([])],
      productPrice: ['', Validators.compose([])],
      categoryId: ['', Validators.compose([])],
      productQuantity: ['', Validators.compose([])],
      // companyId: ['', Validators.compose([])],
      companyName: ['', Validators.compose([])],
      vendorName: ['', Validators.compose([])],
      companyQuantity: ['', Validators.compose([])],
    });


    this.dataService.currentUser.subscribe((user) => {
      if (user) this.currentUser = user;
    });
  }

  ngOnInit() {
    this.getVendorList();
   // this.getModules();
  }

  getVendorList(){
    this.vendorService.VendorsList(false).subscribe((res) =>{
      this.vendorList = res?.data;
    })
  }

  selectVenderIDName(venderData){
    this.selectedVendorData=venderData
  }
  selectCompanyIDName(comapnyData){
    this.selectedCompanyData=comapnyData
 }
  addItem(){
    this.companyDataList.forEach((company,i)=> {
      if(this.selectedCompanyData?._id== company?._id){
        this.companyDataList[i].isSelected = true
      }
    });
    this.vendorList.forEach((vender,i)=> {
      if(this.selectedVendorData?._id== vender?._id){
        this.vendorList[i].isSelected = true
      }
    });
    this.companyList.push({
     quantity:this.addForm.value.companyQuantity,
     companyId:this.selectedCompanyData?._id,
     name:this.addForm.value?.companyName,
     vendorId:this.selectedVendorData?._id,
     vendorName:this.selectedVendorData?.vendorName,
    })
    this.addForm.controls['companyQuantity'].reset()
    this.addForm.controls['companyName'].reset()
    this.addForm.controls['vendorName'].reset()
   }

   removeItem(companyData,index){
     this.companyList.splice(index, 1);
     this.companyDataList.forEach((company,i)=> {
      if(companyData?.companyId == company?._id){
        this.companyDataList[i].isSelected = false
      }
    });
   }

  getCompanyList(){
    this.companyService.companyList(false).subscribe((res:any) => {
      if(res){
        this.companyDataList = res?.data;
        this.companyDataList.forEach((company) => {
          company.isSelected = false;
        });
      }

    })
  }



  getCategoryList(){
    this.productcategoryService.ProductcategoryList(false).subscribe((res:any) => {
      this.CategoryList = res?.data;
    })
  }

  removeItemImage(index){
    this.purchaseimageList.splice(index, 1);
  }
  addFiles(selectedFile){
    // this.purchaseimageList.push(selectedFile.name)
    this.purchaseimageList.push({
      imagearray:this.selectedFile.name
     })
     this.addForm.controls['productOtherImages'].reset()
  }
  fileChange(fileInput: any) {
    const reg = /(.*?)\.(jpg|jpeg|png|gif|giff)$/;
    if (!fileInput.target.files[0].name.match(reg)) {
      this.removeFiles();
      return false;
    } else {
      this.removeFiles();
      this.selectedProfileFile = null;
     this.selectedProfileFile = fileInput.target.files[0];
      this.selectedFile = fileInput.target.files[0];
      var reader = new FileReader();
      reader.onload = this.handleReaderLoadeds.bind(this);
      reader.readAsBinaryString(this.selectedFile);
    }
  }
  handleReaderLoadeds(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = 'data:image/png;base64,' + btoa(binaryString);
  }

  getEditObject() {
    this.productService.GetProductById(this.editId).subscribe((response) => {
      if (response) {
        this.showLoader = false;
        this.selectedCategory = response?.data?.categoryId;
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
        if (response?.data?.inactivemoduleIds?.length != 0) {
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
        if (response?.data?.expiredmoduleIds?.length != 0) {
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
        this.router.navigateByUrl('/product');
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
      const payLoad={
        productName:this.addForm.value?.productName,
        productDescription:this.addForm.value?.productDescription,
        productOtherImages:this.addForm.value?.productOtherImages,
        productSku:this.addForm.value?.productSku,
        productPrice:this.addForm.value?.productPrice,
        categoryId:this.addForm.value?.categoryId,
        productQuantity:this.addForm.value?.productQuantity,
        image:{
          imageBase64:this.base64textString
        },
      }
      if (this.isEditing) {
        this.productService.ProductUpdate(this.editId, payLoad).subscribe(
          (response) => {
            this.showLoader = false;
            if (response) {
              this.router.navigateByUrl('/product');
            } else {
            }
          },
          (error) => {
            this.showLoader = false;
          }
        );
      } else {
        this.productService.saveProduct(payLoad).subscribe(
          (response) => {
            this.showLoader = false;
            if (response) {
              this.router.navigateByUrl('/product');
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
  ChangeEvent(fileInput: any) {
    const reg = /(.*?)\.(jpg|jpeg|png|gif|giff)$/;
    if (!fileInput.target.files[0].name.match(reg)) {
      this.removeFile();
      return false;
    } else {
      this.removeFile();
      this.selectedFile = fileInput.target.files[0];
      var reader = new FileReader();
      reader.onload = this.imagehandleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.selectedFile);
    }
  }
  removeFiles() {
    this.selectedFile = null;
  }
  imagehandleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = 'data:image/png;base64,' + btoa(binaryString);
  }
  fileChangeEvent(fileInput: any) {
    const reg = /(.*?)\.(jpg|jpeg|png|gif|giff)$/;
    if (!fileInput.target.files[0].name.match(reg)) {
      this.removeFile();
      return false;
    } else {
      this.removeFile();
      this.ArrayOfSelectedFile= [];
      this.selectedFile = fileInput.target.files[0];
      for (var i = 0; i <= fileInput.target.files.length - 1; i++) {
        var selectedFile = fileInput.target.files[i];
        this.fileList.push(selectedFile);
        this.listOfFiles.push(selectedFile.name)
      }

      this.attachment.nativeElement.value = '';

      var reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.selectedFile);
    }
  }
  removeFile() {
    this.selectedFile = null;
  }

  removeSelectedFile(index) {
    // Delete the item from fileNames list
    this.listOfFiles.splice(index, 1);
    // delete file from FileList
    this.fileList.splice(index, 1);
   }
  handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = 'data:image/png;base64,' + btoa(binaryString);
  }

  validateText(event: any) {
    keyPressAlpha(event);
  }
  validateAddress(event: any) {
    keyPressAddress(event);
  }
  ngOnDestroy(): void {}
}
