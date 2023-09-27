import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray,} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DataService } from 'src/app/service/data.service';
import { keyPressAddress, keyPressAlpha } from 'src/app/shared/common';
import { AuthService } from 'src/app/service/auth.service';
import { PurchaseOrderService } from 'src/app/service/purchase-order.service';
import { VendorsSupplierService } from 'src/app/service/vendors-supplier.service';
import { ProductService } from 'src/app/service/product.service';
@AutoUnsubscribe()

@Component({
  selector: 'app-purchase-order-add',
  templateUrl: './purchase-order-add.component.html',
  styleUrls: ['./purchase-order-add.component.scss']
})
export class PurchaseOrderAddComponent implements OnInit {

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
  selectedImageList: any = [];
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
  documentImageArray: FormArray;
  imageList: any = [
    {
      imageName:"firstone",
    },
    {
      imageName:"secondone",
    }
  ];
  vendorList: any = [
    {
      vendorName:"firstvendor",
      vendorID:"62c3ee9b3d7321f97c39efb5",
    },
    {
      vendorName:"secondvendor",
      vendorID:"62c3ee9b3d7321f97c39efb5",
    }
  ];
  selectedvendor: Array<any> = [];
  url: any;
  ArrayOfSelectedFile = new Array<string>();
  @ViewChild('attachments') attachment: any;
  fileList: File[] = [];
  listOfFiles: any[] = [];
  productList:any;
  selectedProduct:[]
  orderList=[]
  purchaseimageList=[]
  selectedOrderData:any
  selectedVendorData:any
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private purchaseService: PurchaseOrderService,
    private dataService: DataService,
    private authService: AuthService,
    private vendorService: VendorsSupplierService,
    private productService: ProductService,
  ) {
    this.selectedvendor= [];
    this.vendorsList();
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) {
        this.getEditObject();
      }
    }
    this.addForm = this.fb.group({
      purchaseName: [null, Validators.compose([Validators.required])],
      purchasePrice: ['', Validators.compose([])],
      purchaseStatus: ['', Validators.compose([])],
      // purchaseStatusUpdatedBy: ['62bf59500fafce11fcb4c78f', Validators.compose([])],
      productDetails: ['', Validators.compose([])],
      vendorId: ['', Validators.compose([])],
      vendorName: ['', Validators.compose([])],
      // companyId: ['62c3d7b794a3fe51e689162e', Validators.compose([])],
      documentsImageArray: ['', Validators.compose([])],
      // image:  [''],
      image:['', Validators.compose([])],
      productQuantity: ['', Validators.compose([])],
      productName:['', Validators.compose([])],
      productPrice:['', Validators.compose([])],
      purchaseImage:['', Validators.compose([])],
    });

    this.dataService.currentUser.subscribe((user) => {
      if (user) this.currentUser = user;
    });
  }

  ngOnInit() {
    this.getAllProduct();
  }
  removeItemImage(index){
    this.purchaseimageList.splice(index, 1);
  }
  addFiles(selectedFile){
    // this.purchaseimageList.push(selectedFile.name)
    this.purchaseimageList.push({
      imagearray:this.selectedFile.name
     })
     this.addForm.controls['purchaseImage'].reset()
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

  removeFiles() {
    this.selectedFile = null;
  }

  handleReaderLoadeds(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = 'data:image/png;base64,' + btoa(binaryString);
  }

  getAllProduct() {
    this.productService.ProductList(false).subscribe(
      (response: any) => {
      this.productList = response?.data;
      this.productList.forEach((product) => {
        product.isSelected = false;
      });

    })
  }

  selectProductIDName(data){
    this.selectedOrderData = data
   let totalPrice=this.selectedOrderData?.productPrice*Number(this.addForm.get('productQuantity').value)
    this.addForm.get('purchasePrice').setValue(totalPrice);
    this.addForm.get('productPrice').setValue(this.selectedOrderData?.productPrice);
   }
   selectVenderIDName(data){
    this.selectedVendorData = data
   }

  onKey(event){
    if(event.target.value<1){
        event.target.value=null
      }else{
        let totalPrice=this.selectedOrderData?.productPrice*Number(event.target.value)
        this.addForm.get('purchasePrice').setValue(totalPrice);
      }
  }

   addItem(){
    this.vendorList.forEach((vender,i)=> {
      if(this.selectedVendorData?._id== vender?._id){
        this.vendorList[i].isSelected = true
      }
    });

    this.productList.forEach((product,i)=> {
      if(this.selectedOrderData?._id== product?._id){
        this.productList[i].isSelected = true
      }
    });
     this.orderList.push({
      quantity:this.addForm.value.productQuantity,
      productName:this.selectedOrderData?.productName,
      vendorName:this.selectedVendorData?.vendorName,
      price:this.addForm.value.purchasePrice,
      vendorId: this.selectedVendorData?._id,
      productId:this.selectedOrderData?._id
     })
     this.addForm.controls['productQuantity'].reset()
     this.addForm.controls['productName'].reset()
     this.addForm.controls['purchasePrice'].reset()
     this.addForm.controls['vendorId'].reset()
     this.addForm.controls['productPrice'].reset()
    }

    removeItem(data,index){
      this.orderList.splice(index, 1);
      this.vendorList.forEach((vender,i)=> {
        if(data?.vendorId == vender?._id){
          this.vendorList[i].isSelected = false
        }
      });

      this.productList.forEach((product,i)=> {
        if(data?.productId == product?._id){
          this.productList[i].isSelected = false
        }
      });
    }

  vendorsList(){
    this.vendorService.VendorsList(false).subscribe((res:any) => {
      this.vendorList = res?.data;
      this.vendorList.forEach((vender) => {
        vender.isSelected = false;
      });

    })
  }

  getEditObject() {
    this.purchaseService.GetPurchaseOrderById(this.editId).subscribe((response) => {
      if (response) {
        this.selectedImageList=response?.data?.documentsImageArray
        this.selectedvendor = response?.data?.vendorId;
        // this.addForm.patchValue(response?.data)
        this.addForm.patchValue({
          purchaseName:response?.data?.purchaseName,
          purchasePrice: response?.data?.purchasePrice,
          purchaseStatus: response?.data?.purchaseStatus,
          purchaseStatusUpdatedBy: response?.data?.purchaseStatusUpdatedBy,
          productDetails:response?.data?.productDetails,
          vendorId: this.selectedvendor,
          companyId:response?.data?.companyId,
          documentsImageArray:this.selectedImageList
        })

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
      // const params = {
      //   purchaseName: this.addForm.value?.purchaseName,
      //   purchasePrice: this.addForm.value?.purchasePrice,
      //   productDetails: this.addForm.value?.productDetails,
      //   purchaseStatus: this.addForm.value?.purchaseStatus,
      //   vendorId: this.selectedvendor,
      //   image: this.base64textString

      // };
      this.showLoader = true;
      if (this.isEditing) {
        this.purchaseService.PurchaseOrderUpdate(this.editId, this.addForm.value).subscribe(
          (response) => {
            this.showLoader = false;
            if (response) {
              this.router.navigateByUrl('/purchase-order');
            } else {
            }
          },
          (error) => {
            this.showLoader = false;
          }
        );
      } else {
        this.purchaseService.savePurchaseOrder({ ...this.addForm.value }).subscribe(
          (response) => {
            this.showLoader = false;
            if (response) {
              this.router.navigateByUrl('/purchase-order');
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
  fileChangeEventImage(fileInput: any) {
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
        // this.listOfFiles.push(selectedFile.name)
      }

      this.attachment.nativeElement.value = '';

      var reader = new FileReader();
      reader.onload = this.handleReaderLoadeder.bind(this);
      reader.readAsBinaryString(this.selectedFile);
    }
  }
  addImageFiles(selectedFile){
    this.listOfFiles.push(selectedFile.name)
    this.addForm.controls['image'].reset()
  }
  handleReaderLoadeder(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = 'data:image/png;base64,' + btoa(binaryString);
  }
  removeSelectedFile(index) {
    // Delete the item from fileNames list
    this.listOfFiles.splice(index, 1);
    // delete file from FileList
    this.fileList.splice(index, 1);
   }
  validateText(event: any) {
    keyPressAlpha(event);
  }
  validateAddress(event: any) {
    keyPressAddress(event);
  }
  ngOnDestroy(): void {}

}
