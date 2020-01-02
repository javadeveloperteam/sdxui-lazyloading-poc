import { Component, OnInit } from '@angular/core';
import { Helpers } from 'src/app/helpers/helpers';
import { Router } from '@angular/router';

import { headerService } from './services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  profileImageURL: String;

  constructor(
    private router: Router,
    private headerService: headerService
  ) { }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let userId = currentUser.userId;
    console.log('Header: Current User Id- ' + userId);
    if(userId!=null){
      this.getProfileImage(userId);
    }
  }

  logout() {
    Helpers.logout();
    this.router.navigate(['/login']);
  }

  getProfileImage(userId:String){
    this.headerService.getUserProfileImage(userId).subscribe(
      res =>{
         let users = res;
          let profileImage = users['profileImage'];
          if(profileImage!=null){
            this.profileImageURL = 'data:image/jpg;base64,' + users['profileImageBytes'];
            console.log('profileImgURL' + this.profileImageURL);
          }
      },
      err=>{
          console.log('Unable to load the profile image');
      }
    );
  }

}
