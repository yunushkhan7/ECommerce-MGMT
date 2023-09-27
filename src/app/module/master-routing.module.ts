import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterLayoutComponent } from '../core/layout/sidebar/master-layout.component';
import { CompanyRedirectService, IsCompanySelected } from '../service/_guards';

const routes: Routes = [
  {
    path: '',
    component: MasterLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'report-dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
      },
      {
        path: 'role',
        loadChildren: () => import('./role/role.module').then(m => m.RoleModule),
      },
      {
        path: 'product-category',
        loadChildren: () => import('./product-category/product-category.module').then(m => m.ProductCategoryModule),
      },
      {
        path: 'task',
        loadChildren: () => import('./task/task.module').then(m => m.TaskModule),
      },
      {
        path: 'task-management',
        loadChildren: () => import('./task-managment/task-managment.module').then(m => m.TaskManagmentModule),
      },
      {
        path: 'company',
        loadChildren: () => import('./company/company.module').then(m => m.CompanyModule),
        canActivate: [CompanyRedirectService],
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      },
      {
        path: 'analyst-product',
        loadChildren: () => import('./analyst-product/analyst-product.module').then(m => m.AnalystProductModule),
      },
      {
        path: 'procurmenet-analyst-product',
        loadChildren: () => import('./procurmenet-analyst-product/procurmenet-analyst-product.module').then(m => m.ProcurmenetAnalystProductModule),
      },
      // {
      //   path: 'marketing',
      //   loadChildren: () => import('./marketing/marketing.module').then(m => m.MarketingModule),
      // },
      {
        path: 'vendors',
        loadChildren: () => import('./vendors-supplier/vendors-supplier.module').then(m => m.VendorsSupplierModule),
      },
      {
        path: 'procurmenet-vendors',
        loadChildren: () => import('./procurmenet-vendor/procurmenet-vendor.module').then(m => m.ProcurmenetVendorModule),
      },
      {
        path: 'purchase-order',
        loadChildren: () => import('./purchase-order/purchase-order.module').then(m => m.PurchaseOrderModule),

      },
      {
        path: 'product',
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),

      },
      {
        path: 'sales-order',
        loadChildren: () => import('./sales-order/sales-order.module').then(m => m.SalesOrderModule),

      },
      {
        path: 'delivery-partner',
        loadChildren: () => import('./delivery-partner/delivery-partner.module').then(m => m.DeliveryPartnerModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
