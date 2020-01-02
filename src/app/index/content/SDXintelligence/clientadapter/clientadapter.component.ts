import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClientAdapterService } from './services/clientadapter.service';
import { CommonService } from 'src/app/common/services/common.service';
import { Client } from './model/client';
import { ApplicationService } from '../application/services/application.service';
import { EventService } from '../event/services/event.service';
import { EventVariableService } from '../eventvariable/services/eventvariable.service';
import { AssetService } from '../asset/services/asset.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-clientadapter',
  templateUrl: './clientadapter.component.html',
  styleUrls: ['./clientadapter.component.css']
})
export class ClientadapterComponent implements OnInit {
  showLoader = false;
  applicationList: any = [];
  eventList: any = [];
  variableList: any = [];
  assetList: any = [];
  clientForm: FormGroup;
  submitted: boolean;
  showAppError: boolean;
  showEventError: boolean;
  clientModel: Client;


  constructor(private clientAdapterService: ClientAdapterService,
              private commonService: CommonService,
              private router: Router,
              private applicationService: ApplicationService,
              private eventService: EventService,
              private eventVariableService: EventVariableService,
              private assetService: AssetService) { }

  ngOnInit() {
    this.showLoader = true;
    this.applicationList = [];
    this.eventList = [];
    this.variableList = [];
    this.assetList = [];
    this.submitted = false;
    this.showAppError = false;
    this.showEventError = false;
    this.clientModel = new Client();
    this.loadApplication();
    this.loadAsset();
  }
  loadAsset() {
    this.assetService.getAllAssets().subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        this.assetList = res;
      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Asset Load Failed', 'badge-danger');
        console.log('Error occured');
      }
    );
  }
  loadApplication() {
    this.applicationService.getAllApplication().subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        this.applicationList = res;
      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Application Load Failed', 'badge-danger');
        console.log('Error occured');
      }
    );
  }

  loadEvents(args): any {
    this.showAppError = false;
    this.showEventError = false;
    this.showLoader = true;
    const applicationId = args.target.value;
    const applicationName = args.target.options[args.target.selectedIndex].text;
    this.clientModel.applicationId = applicationId;
    this.clientModel.applicationName = applicationName;
    this.eventService.getAllEventsByApplication(applicationId).subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        this.eventList = res;
      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Application Load Failed', 'badge-danger');
        console.log('Error occured');
      }
    );
}

loadEventVariables(args): any {
  this.showAppError = false;
  this.showEventError = false;
  this.showLoader = true;
  const eventId = args.target.value;
  const eventName = args.target.options[args.target.selectedIndex].text;
  this.clientModel.eventId = eventId;
  this.clientModel.eventName = eventName;
  this.eventVariableService.getAllVariableByEvent(eventId).subscribe(
    res => {
      console.log(res);
      this.showLoader = false;
      this.variableList = res;
    },
    err => {
      console.log('Error occured');
      this.showLoader = false;
      console.log(err);
      this.commonService.openSnackBar('Event Variable Load Failed : ' + err.error.message, 'badge-danger');
    }
  );
}

  onSubmit($form) {
    this.showAppError = this.clientModel.applicationId == null;
    this.showEventError = this.clientModel.eventId == null;
    if ( this.showAppError || this.showEventError){
      return;
    }
    this.showLoader = true;
    const form = document.getElementById('clientForm');
    const elements = form.querySelectorAll( 'input' );
    const eventVariableList = {};
    for (let i = 0; i < elements.length; i++ ) {
      const element = elements[i];
      const name = element.name;
      const value = element.value;

      if (value) {
        if(element.type === 'number'){
          eventVariableList[name] = parseInt(value);
        } else {
          eventVariableList[name] = value;
        }

    }
    }
    const eventObj = { event : {}};
    eventObj.event = eventVariableList;
    this.clientModel.payload = JSON.stringify(eventObj);
    this.executeEvent(this.clientModel);
  }

  executeEvent(eventDto: any) {
    this.clientAdapterService.executeEvent(eventDto).subscribe(
      res => {
          this.showLoader = false;
          console.log(res);
          this.commonService.openSnackBar('Event Executed Successfully', 'badge-success');
          this.resetPage();
      },
      err => {
          this.showLoader = false;
          this.commonService.openSnackBar('Event Execution Failed : ' + err.error.message, 'badge-danger');
          console.error(err);
          console.log('Error occured');
      }
  );
  }

  resetPage() {
    CommonService.resetPage(this.router);
  }

  assetChanged(args){
    const assetId = args.target.value;
    const assetName = args.target.options[args.target.selectedIndex].text;
    this.clientModel.assetId = assetId;
    this.clientModel.assetName = assetName;
  }


}
