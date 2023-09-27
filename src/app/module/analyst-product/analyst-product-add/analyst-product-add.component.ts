import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DataService } from 'src/app/service/data.service';
import { keyPressAddress, keyPressAlpha } from 'src/app/shared/common';
import { AuthService } from 'src/app/service/auth.service';
import { AnalystProductService } from 'src/app/service/analyst-product.service';
import { ProductcategoryService } from 'src/app/service/productcategory.service';
import { VendorsSupplierService } from 'src/app/service/vendors-supplier.service';
import { TaskManagementService } from 'src/app/service/task-management.service';
import { CompanyService } from 'src/app/service/company.service';
@AutoUnsubscribe()

@Component({
  selector: 'app-analyst-product-add',
  templateUrl: './analyst-product-add.component.html',
  styleUrls: ['./analyst-product-add.component.scss']
})
export class AnalystProductAddComponent implements OnInit {

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
  companyList=[]
  companyDataList:any;
  selectedCompany:[]
  selectedCompanyData:any
  subCategoryList = [
    {
      name: 'Marketing'
    },
    {
      name: 'Analysis'
    }
  ];
  selectedFile: any;
  url: any;
  base64textString:any;
  selectedCategory:any
  selectedTaskmanagementList:any;
  selectedVendor:any;
  CategoryList :any;
  vendorList:any;
  taskmanagementList:any;
  selectedVendorData:any

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private analystService: AnalystProductService,
    private dataService: DataService,
    private authService: AuthService,
    private productService: ProductcategoryService,
    private vendorService: VendorsSupplierService,
    private taskManagementService: TaskManagementService,
    private companyService: CompanyService,
  ) {
    this.selectedCategory= [];
    this.getCategoryList();
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) {
        this.getEditObject();
      }
    }

    // name: { type: String, unique: true },
    // description: { type: String },
    // image: { type: String },
    // otherImage: { type: String },
    // quantity: { type: Number },
    // sku: { type: String, unique: true },
    // prize: { type: Number },
    // status: {
    //   type: String,
    //   required: true,
    //   default: "active",
    //   enum: ["active", "deleted"],
    // },
    // categoryId: [{ type: Schema.Types.ObjectId, ref: "category" }],
    // vendorId: [{ type: Schema.Types.ObjectId, ref: "vendor" }],
    // taskManagmentId: [{ type: Schema.Types.ObjectId, ref: "taskManagement" }],
    // createdBy: { type: String, required: true, default: "system" },
    // updatedBy: { type: String, required: true, default: "system" },

    this.addForm = this.fb.group({
      name: [null, Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      quantity: ['', Validators.compose([])],
      sku: ['', Validators.compose([])],
      prize: ['', Validators.compose([])],
      // status: ['', Validators.compose([])],
      categoryId: ['', Validators.compose([])],
      vendorId: ['', Validators.compose([])],
      taskManagmentId: ['', Validators.compose([])],
      image: ['', Validators.compose([])],
      companyName: ['', Validators.compose([])],
      vendorName: ['', Validators.compose([])],
      companyQuantity: ['', Validators.compose([])],
    });
    this.dataService.currentUser.subscribe((user) => {
      if (user) this.currentUser = user;
    });
  }

  ngOnInit() {
    this.getCompanyList()
    this.getVendorList();
    this.getTaskmanagementList()
  }

  getCategoryList(){
    this.productService.ProductcategoryList(false).subscribe((res:any) => {
      this.CategoryList = res?.data;
    })
  }

  getVendorList(){
    this.vendorService.VendorsList(false).subscribe((res) =>{
      this.vendorList = res?.data;
    })
  }
  selectVenderIDName(venderData){
    this.selectedVendorData=venderData
 }
  getTaskmanagementList(){
    this.taskManagementService.TaskManagementList(false).subscribe((res) =>{
      this.taskmanagementList = res?.data;
    })
  }

  getEditObject() {
    this.analystService.GetAnalystById(this.editId).subscribe((response) => {
      if (response?.data) {
        this.addForm.patchValue(response?.data);
        this.selectedCategory = response?.data?.categoryId;
        this.selectedVendor = response?.data?.vendorId;
        this.selectedTaskmanagementList = response?.data?.taskManagmentId;
        // this.addForm.patchValue({
        //   name:response?.data.name,
        //   description:response?.data?.description,
        //   quantity:response?.data?.quantity,
        //   sku:response?.data?.sku,
        //   prize:response?.data?.prize,
        //   status:response?.data?.status,
        //   categoryId:this.selectedCategory,
        //   vendorId:this.selectedVendor
        // })
      } else {
        this.router.navigateByUrl('/company');
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
  submitForm() {
    if (this.addForm.valid) {
      const payLoad={
        name: this.addForm.value.name,
        description: this.addForm.value.description,
        quantity:this.addForm.value.quantity,
        sku: this.addForm.value.sku,
        prize: this.addForm.value.prize,
        categoryId:this.addForm.value.categoryId,
        vendorId: this.addForm.value.vendorId,
        taskManagmentId: this.addForm.value.taskManagmentId,
        image:{
          imageBase64:this.base64textString
        }
      }
      this.showLoader = true;
      if (this.isEditing) {
        this.analystService.AnalystUpdate(this.editId,payLoad).subscribe(
          (response) => {
            this.showLoader = false;
            if (response) {
              this.router.navigateByUrl('/analyst-product');
            } else {
            }
          },
          (error) => {
            this.showLoader = false;
          }
        );
      } else {
        this.analystService.saveAnalystProduct(payLoad).subscribe(
          (response) => {
            this.showLoader = false;
            if (response) {
              this.router.navigateByUrl('/analyst-product');
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

  ngOnDestroy(): void {}

}
