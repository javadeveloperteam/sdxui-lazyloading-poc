import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApplicationService } from '../../../SDXintelligence/application/services/application.service';
import { CommonService } from 'src/app/common/services/common.service';

@Component({
  selector: 'app-alert-popup',
  templateUrl: './alert-popup.component.html',
  styleUrls: ['./alert-popup.component.css']
})
export class AlertPopupComponent implements OnInit {
  alert: boolean = false;
  submit: boolean = false;
  alertContent: string;
  showLoader: boolean;
  isDelete: boolean = false;
  header : any = '';
  component: string;
  popupData: any = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<any>,  
    private applicationService: ApplicationService,
    private commonService: CommonService) {
   
     }


  ngOnInit() {
    this.isDelete = false
    this.component = this.data.component
    if (this.data.type == "alert") {
      this.alert = true
      this.submit = false
      this.header = 'INFO';
    } else if (this.data.type == "submit") {
      this.alert = false
      this.submit = true
      this.header = 'CONFIRM';
    }
    this.alertContent = this.data.content;
  }


  yesPopup() {
    //for deleting

    this.isDelete =  true
 this.dialogRef.close(AlertPopupComponent);

  }
  
}