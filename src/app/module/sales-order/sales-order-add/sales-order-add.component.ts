import { Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DataService } from 'src/app/service/data.service';
import { keyPressAddress, keyPressAlpha } from 'src/app/shared/common';
import { AuthService } from 'src/app/service/auth.service';
import { SalesOrderService } from 'src/app/service/sales-order.service';
import { DeliveryPartnerService } from 'src/app/service/delivery-partner.service';
import { environment } from 'src/environments/environment';
import { ProductService } from 'src/app/service/product.service';
@AutoUnsubscribe()

@Component({
  selector: 'app-sales-order-add',
  templateUrl: './sales-order-add.component.html',
  styleUrls: ['./sales-order-add.component.scss']
})
export class SalesOrderAddComponent implements OnInit {
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
  paymenytList = [
    {
      name: 'cash'
    },
    {
      name: 'online'
    }
  ];
  selectedList: any = [];
  deliveryList:any;
  productList:any;
  currentPage: any = 1;
  currentPageLimit = environment.defaultPageLimit;
  selectedProduct:[]
  selectedProductData:any
  productDataList=[]
  selectedFile: any;
  url: any;
  base64textString:any;
  ArrayOfSelectedFile = new Array<string>();
  selectedProfileFile: any;
  purchaseimageList=[]
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private salesOrderService: SalesOrderService,
    private dataService: DataService,
    private authService: AuthService,
    private deliveryService: DeliveryPartnerService,
    private productService: ProductService,
  ) {
    this.selectedList = []
    this.getAllDelivery();
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) {
        this.getEditObject();
      }
    }
    this.addForm = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      productDetails: ['', Validators.compose([])],
      salesPrice: ['', Validators.compose([])],
      // statusUpdatedBy: ['', Validators.compose([])],
      paymentType: ['', Validators.compose([])],
      // paymentGatewayResponse: ['', Validators.compose([])],
      shipmentCharges: ['', Validators.compose([])],
      deliveryPartnerId: ['', Validators.compose([])],
      // companyId: ['', Validators.compose([])],
      productQuantity: ['', Validators.compose([])],
      productName:['', Validators.compose([])],
      productPrice:['', Validators.compose([])],
      image:['', Validators.compose([])],
      purchasePrice: ['', Validators.compose([])],
    });

    this.dataService.currentUser.subscribe((user) => {
      if (user) this.currentUser = user;
    });
  }

  ngOnInit() {
    this.getAllProduct();
  }
  getAllDelivery() {
    this.deliveryService.DeliveryPartnerList(false).subscribe(
      (response: any) => {
      this.deliveryList = response?.data;
    })
  }
  getAllProduct() {
    this.productService.ProductList(false).subscribe((response: any) => {
      this.productList = response?.data;
      this.productList.forEach((product) => {
        product.isSelected = false;
      });
    })
  }
  selectProductIDName(data){
   this.selectedProductData = data
   let totalPrice=this.selectedProductData?.productPrice*Number(this.addForm.get('productQuantity').value)
   this.addForm.get('purchasePrice').setValue(totalPrice);
   this.addForm.get('productPrice').setValue(this.selectedProductData?.productPrice);
  }

  addItem(){
     this.productList.forEach((product,i)=> {
  if(this.selectedProductData?._id== product?._id){
    this.productList[i].isSelected = true
  }
});
    this.productDataList.push({
     quantity:this.addForm.value.productQuantity,
     price:this.addForm.value.purchasePrice,
     productId:this.selectedProductData?._id,
     name:this.addForm.value?.productName,
    })
    this.addForm.controls['productQuantity'].reset()
    this.addForm.controls['purchasePrice'].reset()
    this.addForm.controls['productName'].reset()
    this.addForm.controls['productPrice'].reset()
   }


   removeItem(productData,index){
     this.productDataList.splice(index, 1);
     this.productList.forEach((product,i)=> {
      if(productData?.productId == product?._id){
        this.productList[i].isSelected = false
      }
    });
   }
   removeItemImage(index){
    this.purchaseimageList.splice(index, 1);

  }
  onKey(event){
    if(event.target.value<1){
        event.target.value=null
      }else{
        let totalPrice=this.selectedProductData?.productPrice*Number(event.target.value)
        this.addForm.get('purchasePrice').setValue(totalPrice);
      }
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

      return false;
    } else {

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
    this.salesOrderService.GetSalesOrderById(this.editId).subscribe((response) => {
      if (response?.data) {
        this.addForm.patchValue(response?.data);

        this.selectedList = response?.data?.deliveryPartnerId;
        this.addForm.patchValue({
          name:response?.data.name,
          productDetails:response?.data?.productDetails,
          salesPrice:response?.data?.salesPrice,
          paymentType:response?.data?.paymentType,
          shipmentCharges:response?.data.shipmentCharges,
          deliveryPartnerId:this.selectedList,
        })
      } else {
        this.router.navigateByUrl('/company');
      }
    });
  }

  submitForm() {
    if (this.addForm.valid) {
      this.showLoader = true;
      if (this.isEditing) {
        this.salesOrderService.updateSalesOrder(this.editId, this.addForm.value).subscribe(
          (response) => {
            this.showLoader = false;
            if (response) {
              this.router.navigateByUrl('/sales-order');
            } else {
            }
          },
          (error) => {
            this.showLoader = false;
          }
        );
      } else {
        this.salesOrderService.saveSalesOrder({ ...this.addForm.value }).subscribe(
          (response) => {
            this.showLoader = false;
            if (response) {
              this.router.navigateByUrl('/sales-order');
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
        // this.listOfFiles.push(selectedFile.name)
      }

      this.attachment.nativeElement.value = '';

      var reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.selectedFile);
    }
  }
  addImageFiles(selectedFile){
    this.listOfFiles.push(selectedFile.name)
    this.addForm.controls['image'].reset()
  }
  handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = 'data:image/png;base64,' + btoa(binaryString);
  }
  removeSelectedFile(index) {
    // Delete the item from fileNames list
    this.listOfFiles.splice(index, 1);
    // delete file from FileList
    this.fileList.splice(index, 1);
   }
   removeFile() {
    this.selectedFile = null;
  }
  validateText(event: any) {
    keyPressAlpha(event);
  }
  validateAddress(event: any) {
    keyPressAddress(event);
  }
  ngOnDestroy(): void {}

}
