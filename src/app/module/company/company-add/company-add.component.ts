import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DataService } from 'src/app/service/data.service';
import { CompanyService } from 'src/app/service/company.service';
import { emailRegEx, keyPressAddress, keyPressAlpha } from 'src/app/shared/common';
import { ProductcategoryService } from 'src/app/service/productcategory.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
@AutoUnsubscribe()
@Component({
  selector: 'app-company-add',
  templateUrl: './company-add.component.html',
  styleUrls: ['./company-add.component.scss'],
})
export class CompanyAddComponent implements OnInit {
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
  currentHotel: any;
  currentTenant: any;
  selectedCategory:any
  CategoryList :any;
  selectedProfileFile: any;
  selectedFile: any;
  url: any;
 base64textString:any;
  dateFormatList=['M/d/yy','MMM d, y','MMM d, y','MMMM d, y','EEEE, MMMM d, y']
  timeFormatList=['h:mm a','h:mm:ss a','h:mm:ss a z','h:mm:ss a zzzz']
  // languageList=['English','Japanese','Italian','Indonesian','	Hindi']
  timeZoneList=[
    '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi',
    '(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
    '(UTC+08:00) Kuala Lumpur, Singapore',
    '(UTC+09:00) Osaka, Sapporo, Tokyo',
    '(UTC+07:00) Bangkok, Hanoi, Jakarta',
    '(UTC-05:00) Indiana (East)',
  ]
  activeLang: string;
  languageList = environment.language;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private companyService: CompanyService,
    private dataService: DataService,
    private productService: ProductcategoryService,
    public translate: TranslateService,
  ) {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) {
        this.getEditObject();
      }
    }
    if (localStorage.getItem('currentLanguage')) {
      (translate.getLangs().includes(localStorage.getItem('currentLanguage')) ?
        this.activeLang = localStorage.getItem('currentLanguage') :
        this.activeLang = environment?.defaultLangCode
      )
    }
    else this.activeLang = environment.defaultLangCode;
    this.dataService.currentUser.subscribe((res) => {
      if (res) {
        this.currentUser = res;
      }
    });

    this.addForm = this.fb.group({
        name: ['', Validators.compose([Validators.required])],
        categoryId:['', Validators.compose([])],
        dailCode: ['', Validators.compose([])],
        companyEmail:['', [Validators.required, Validators.pattern(emailRegEx)]],
        timeFormat: ['', Validators.compose([])],
        companyCode: ['', Validators.compose([])],
        timeZone: ['', Validators.compose([])],
        dateFormat: ['', Validators.compose([])],
        companyDomain: ['', Validators.compose([Validators.required,Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')])],
        companySubdomain: ['', Validators.compose([Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')])],
        langauage: ['', Validators.compose([])],
        streetAddress:['', Validators.compose([])],
        phoneNumber: ['', Validators.compose([])],
        currency: ['', Validators.compose([])],
        country: ['', Validators.compose([])],
        state:['', Validators.compose([])],
        city: ['', Validators.compose([])],
        pinCode:['', Validators.compose([])],
        status:['', Validators.compose([])],
        firstName:['', Validators.compose([])],
        lastName:['', Validators.compose([])],
        email:['', Validators.compose([])],
        image:['', Validators.compose([])],
    },
    );
    this.dataService.currentUser.subscribe((user) => {
      if (user) this.currentUser = user;
    });
  }

  ngOnInit() {
    this.activeLang = this.translate.currentLang;
    this.getCategoryList()
  }

  onLanguageChange(): void {
    localStorage.setItem('currentLanguage', this.activeLang);
    window.location.reload();
  }

  getEditObject() {
    this.companyService.getCompanyById(this.editId).subscribe((response) => {
      if (response) {
        this.addForm.patchValue(response.data?.company);
        this.addForm.patchValue(response.data?.companyAdmin);
        this.selectedCategory = response?.data?.subCategory
      } else {
        this.router.navigateByUrl('/company');
      }
    });
  }

  submitForm() {
    if (this.addForm.valid) {
      const payLoad={
        name: this.addForm.value.name,
        categoryId:this.addForm.value.categoryId,
        dailCode: this.addForm.value.dailCode,
        companyEmail:this.addForm.value.companyEmail,
        timeFormat: this.addForm.value.timeFormat,
        companyCode: this.addForm.value.companyCode,
        timeZone: this.addForm.value.timeZone,
        dateFormat: this.addForm.value.dateFormat,
        companyDomain: this.addForm.value.companyDomain,
        companySubdomain: this.addForm.value.companySubdomain,
        langauage: this.addForm.value.langauage,
        phoneNumber: this.addForm.value.phoneNumber,
        currency: this.addForm.value.currency,
        country: this.addForm.value.country,
        state:this.addForm.value.state,
        city: this.addForm.value.city,
        streetAddress:this.addForm.value.streetAddress,
        pinCode: this.addForm.value.pinCode,
        status:this.addForm.value.status,
        image:{
          imageBase64:this.base64textString
        },
        admin:{
          firstName:this.addForm.value.firstName,
          lastName:this.addForm.value.lastName,
          email:this.addForm.value.email,
        }
      }
      this.showLoader = true;
      if (this.isEditing) {
        this.companyService
          .companyUpdateById(this.editId, payLoad)
          .subscribe(
            (response) => {
              this.showLoader = false;
              if (response) {
                this.router.navigateByUrl('/company');
              } else {
              }
            },
            (error) => {
              this.showLoader = false;
            }
          );
      } else {
        this.companyService.saveCompany(payLoad).subscribe(
          (response) => {
            this.showLoader = false;
            if (response) {
              this.router.navigateByUrl('/company');
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

  getCategoryList(){
    this.productService.ProductcategoryList(false).subscribe((res:any) => {
      this.CategoryList = res?.data;
    })
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

  ngOnDestroy(): void {}
}
