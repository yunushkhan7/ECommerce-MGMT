import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DataService } from 'src/app/service/data.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']

})
export class ProfileComponent implements OnInit {

  PageTitle = "Profile"
  currentUser: any;

  constructor(
    private dataservice: DataService
  ) { }

  ngOnInit(): void {
    this.dataservice.currentUser.subscribe((responce) => {
      if (responce) {
        this.currentUser = responce;
      }
    });
  }
  ngOnDestroy(): void {  }
}
