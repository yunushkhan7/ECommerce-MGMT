import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DashboardService } from 'src/app/service/dashboard.service';
import { DataService } from 'src/app/service/data.service';
let COUNT = {
  availableCount: 0,
  totalCount: 0,
  utilizedCount: 0
};
@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  permissionObject: any = null;
  currentUser: any;

  platinum: any = COUNT;
  gold: any = COUNT;
  standard: any = COUNT;
  licenseListArray: any = [];

  constructor(
    private dataService: DataService,
    private dashboardService: DashboardService
  ) {
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response
    });
    this.dataService.currentUser.subscribe((response) => {
      if (response) {
        this.currentUser = response;
        this.getLicenseType();
      }
    });
  }

  ngOnInit() {

  }


  public chart = {
    "datasets": [
      // { "data": [0, 30, 20, 40, 35, 45, 33, 0, 0], "label": "Bar 1" },
      { "data": [5, 38, 20, 25, 29, 15, 40], "label": "Line", "type": "line" },
      { "data": [10, 20, 15, 30, 49, 28, 18], "label": "Line", "type": "line" }
    ],
    "labels": ["January", "February", "March", "April", "May", "June", "July"],
    "options": {
      "legend": {
        "text": "You awesome chart with average line",
        "display": true,
      },
      "scales": {
        "yAxes": [{
          "ticks": {
          "beginAtZero": true
          }
        }],
        "xAxes": [{
          "ticks": {
          "min": "January",
          "max": "July",
          }
        }],
      }
    }
  };


  public chartdoughnut = {
    "datasets": [
      { "data": [0, 30, 20, 40, 35, 45, 33, 0, 0], "label": "doughnut", "type": "doughnut" },
      { "data": [0, 50, 60, 55, 59, 30, 40, 0, 0], "label": "doughnut", "type": "doughnut" },
      { "data": [23, 66, 45, 10, 37, 60, 20, 60, 45], "label": "doughnut", "type": "doughnut" }
    ],
    "labels": ["FirstPlaceholder", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "LastPlaceholder"],
    "options": {
      "legend": {
        "text": "You awesome chart with average doughnut",
        "display": true,
      },
      "scales": {
        "yAxes": [{
          "ticks": {
          "beginAtZero": true
          }
        }],
        "xAxes": [{
          "ticks": {
          "min": "Monday",
          "max": "Sunday",
          }
        }],
      }
    }
  };


  getLicenseType() {
    // this.dashboardService.GetLicensorBalanceById(this.currentUser.id).subscribe((res) => {
    //   this.licenseListArray = res.data;

    //   this.calculateCount();
    // })
  }
  calculateCount() {
    this.licenseListArray.map((data) => {
      switch (String(data.licenseType).toLowerCase()) {
        case 'standard':
          this.standard = data;
          break;
        case 'gold':
          this.gold = data;
          break;
        case 'platinum':
          this.platinum = data;
          break;
      }
    })
  }
  ngOnDestroy() {

  }
}
