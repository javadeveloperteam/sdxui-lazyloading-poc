import { Component, OnInit, Input, ViewEncapsulation, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatTable } from '@angular/material';
import { EventStatusService } from '../service/event-status.service';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-event-record-view',
  templateUrl: './event-record-view.component.html',
  styleUrls: ['./event-record-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EventRecordViewComponent implements OnInit {
  @Input() id: string;
  policiesDisplayedColumns = ['policyId', 'policyName', 'ruleId', 'ruleName', 'ruleMessage', 'ruleStatus', 'destinationName'];
  policies: MatTableDataSource<any>;
  eventRecord: any;
  showDialog = false;


  constructor(private eventsService: EventStatusService,
    private dialogRef: MatDialogRef<EventRecordViewComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.id = data.recordId;
  }

  ngOnInit() {
    console.log('tab component called' + this.id);
    this.setEventRecordRow(this.id);
  }

  public setEventRecordRow(recordId: string) {
    console.log('Set event record id ' + recordId);
    this.loadEventRecord(recordId);
  }

  public loadEventRecord(recordId: string): void {

    this.eventsService.getEventRecordById(recordId)
      .subscribe(res => {
        this.eventRecord = res;
        var results = [];
        var row = {};
        this.showDialog = true;
        this.eventRecord.policies.forEach(policy => {

          let { policyId, policyName } = policy;
          let destinations = policy.notifications;
          let tempDest = {}
          const destArray = [];
          // Filter notification, as it comes multiple times based on multiple rules
          destinations.forEach(a => {
            if (tempDest[a.notificationId] == undefined) {
              tempDest[a.notificationId] = a;
              destArray.push(a.notificationName);
            }
          });

          const destNamesStr = destArray.join(",");
          row = {
            policyId: policyId,
            policyName: policyName,
            destinationName: destNamesStr
          };
          policy.rules
            .forEach(rule => {
              row = {
                ...row,
                ruleId: rule['ruleId'],
                ruleName: rule['name'],
                ruleMessage: rule['message'],
                ruleStatus: rule['status']
              };
              results.push(row);
            });
        });
        console.log("results" + JSON.stringify(results));
        this.policies = new MatTableDataSource(results);
      }, err => {
        console.log('Error in fetching the record' + recordId);
      })
  }

  public close() {
    this.dialogRef.close();
  }

}
export interface PolicyRecord {
  policyId: number;
  policyName: string;
  ruleId: number;
  ruleName: string;
  ruleMessage: string;
  ruleStatus: string;
  destinationName: string;
}