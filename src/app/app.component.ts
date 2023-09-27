import { Component, OnInit, Renderer2 } from '@angular/core';
import { DataService } from './service/data.service';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { JwtService } from './service/jwt.service';
import { CommonService } from './service/common.service';
import { filter, map } from 'rxjs/operators';
import { APP_NAME } from './shared/messages';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponentPopup } from './core/change-password-popup/change-password-popup.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  customConfig: any;
  isAuthenticated: boolean;
  previousUrl: string;
  currentUser: any;
  isRootPage: any;
  permissionObject: any = [];
  isLoader = false;
  constructor(
    private renderer: Renderer2,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private jwtService: JwtService,
    private dataService: DataService,
    private meta: Meta,
    private commonService: CommonService,
    public dialog: MatDialog
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.previousUrl) {
          this.renderer.removeClass(document.body, this.previousUrl);
        }
        const currentUrlSlug = event.url.slice(1);
        if (currentUrlSlug) {
          this.renderer.addClass(document.body, currentUrlSlug);
        }
        this.previousUrl = currentUrlSlug;
      }
    });

    this.dataService.isAuthenticated.subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;
    });
    this.dataService.permission.subscribe((response) => {
      response && response.length > 0 ? this.permissionObject = response : '';
    });
    this.globalRouterEvents();
    if (this.jwtService.getToken()) {
      this.refreshPage();
    }
  }

  globalRouterEvents(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
      const rt = this.getChild(this.activatedRoute);
      rt.data.subscribe(data => {
        this.isRootPage = data && data.isRootPage;
        const title = data && data.title;
        const tags = data && data.tags;
        const permissionCode = data && data.permission;
        if (title) {
          this.titleService.setTitle(`${title} | ${APP_NAME}`);
        }
        if (tags) {
          tags.forEach((tag) => {
            this.meta.updateTag(tag);
          });
        }
        // if (data && data.permission) {
        //   if (this.permissionObject.length != 0) {
        //     if (!this.permissionObject?.includes(permissionCode)) {
        //       this.router.navigateByUrl('/dashboard');
        //       return;
        //     }
        //   } else {
        //     this.router.navigateByUrl('/dashboard');
        //     this.dataService.purgeAuth();
        //     this.router.navigateByUrl('/login');
        //     return;
        //   }
        // }
      });
    });
  }

  refreshPage() {
    this.isLoader = true;
    // this.loaderService.show();
    this.commonService.GetCurrentUserProfile().subscribe((response) => {
      // this.loaderService.hide();
      this.isLoader = false;
      if (response) {
        this.dataService.setAuth(response)

        if (response?.user?.isFirstTimeLogin) {
          const dialogRef = this.dialog.open(ChangePasswordComponentPopup, {
            disableClose: true,
            // width: '855px',
            // height: '700px',
            data: response,
            panelClass: 'delete-popup'
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result && result.is_delete) {
              // this.roleService.deleteRole(result.id).subscribe((res) => {
              //   this.getObjects();
              // })
            }
          });
        }
      }
    }, (err) => {
      this.dataService.purgeAuth();
      window.location.reload();
    });
  }

  ngOnInit() { }

  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }
}
