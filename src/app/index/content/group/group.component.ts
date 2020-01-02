import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from 'src/app/common/services/common.service';
import { GroupService } from "../group/services/group.service";
import { FormBuilder, FormGroup, Validators, EmailValidator } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragHandle } from '@angular/cdk/drag-drop';
import { GroupDestDialogComponent } from "../dialog/group-dest-dialog/group-dest-dialog.component";

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  disablemember: Boolean = true;
  submitted: Boolean = false;
  showLoader: Boolean = false;
  departments: any;
  displayedColumns = ['Entity Id', 'Entity Name', 'Active', 'Entity', 'Type', 'Action'];
  dataSource: [];
  group: any;
  currentPage: String = "add";
  buttonName: String = "Create";
  groupForm: FormGroup;
  memberForm: FormGroup;
  destinations: any = [];
  groups: any = [];
  members: any = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<GroupMember>;
  escActive: boolean = false;
  broadcast: boolean = true
  eacalation: boolean = false
  constructor(
    private router: Router,
    private groupService: GroupService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private commonService: CommonService) {
    this.route.params.subscribe(params => this.currentPage = params['page']);
  }


  ngOnInit() {
    // Declare Form

    this.groupForm = this.formBuilder.group({
      groupId: [],
      groupName: ['', Validators.required],
      active: ['true', Validators.required],
      type: [''],
      escalationInterval: [0, Validators.required],
      escalation: [null],
      members: [null],
      comments: [''],
      createdBy: [],
      createdByName: [],
      createdOn: []
    });

    // Patch Values if Edit
    console.log(this.currentPage);
    if (this.currentPage == "edit") {
      this.buttonName = "Update";
      this.disablemember = false;
      let groupId = localStorage.getItem("groupId");
      if (groupId != null) {
        this.getGroup(groupId);
      }
      else {
        this.router.navigate(['index/groups']);
      }
    } else {
      this.radioActive(false)

    }
  }

  getGroup(groupId: any) {
    this.showLoader = true;

    this.groupService.getGroup(groupId).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.group = res;
        this.groupForm.patchValue(this.group);
        this.radioActive(this.group.escalation)
        let members = this.group.members;
        this.dataSource = members;
        if (members != null) {
          for (let i = 0; i < members.length; i++) {
            if (members[i].entityType == 'Group') {
              this.groups.push(new Group(members[i].entityId,members[i].entityName,members[i].active,members[i].type));
            }
            else if (members[i].entityType == 'Destination') {
              this.destinations.push(new Destination(members[i].entityId,members[i].entityName,members[i].active,members[i].type));
            }
            this.members.push(members[i]);
          }
        }
      },
      err => {
        console.log("Error occured");
        this.showLoader = false;
        console.log(err);
        this.commonService.openSnackBar('Group Load Failed: ' + err.error.message, 'badge-danger');
      }
    );
  }
  radioActive(radioValue) {
    if (radioValue == false) {
      this.escActive = false;
      this.broadcast = true;
      this.eacalation = false;
      this.f.escalation.setValue(false);
      this.f.escalationInterval.setValue(0);

    } else if (radioValue == true) {
      this.escActive = true
      this.f.escalation.setValue(true);
      this.broadcast = false;
      this.eacalation = true;
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.groupForm.invalid) {
      console.info('Mandatory Fields Missing');
      return;
    }

    console.log('sumbit');
    if (this.currentPage == "edit") {
      console.log('udpate');
      this.updateGroup();
    }
    else {
      console.log('save');
      this.saveGroup();
    }
  }

  updateGroup() {
    this.showLoader = true;
    this.groupService.updateGroup(this.groupForm.value).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.commonService.openSnackBar("Group Updated Successfully", 'badge-success');
      },
      err => {
        console.error(err);
        console.log("Error occured");
        this.showLoader = false;
        this.commonService.openSnackBar("Group update Failed: " + err.error.message, 'badge-danger');
      }
    );
  }

  saveGroup() {
    this.showLoader = true;
    this.groupService.createGroup(this.groupForm.value).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        let group: any = res;
        this.commonService.openSnackBar("Group Created Successfully", 'badge-success');
        this.disablemember = false;
        this.currentPage = 'edit';
        this.submitted = false;
        localStorage.setItem("groupId", JSON.stringify(group.groupId));
        this.router.navigate(['index/groups/edit']);
        this.ngOnInit();
      },
      err => {
        console.error(err);
        this.showLoader = false;
        console.log("Error occured");
        this.commonService.openSnackBar("Group Creation Failed : " + err.error.message, 'badge-danger');
      }
    );
  }

  deleteMember(memberId: any) {
    let temp = this.members;
    for (let i = 0; i < temp.length; i++) {
      if (memberId == temp[i].entityId) {
        if (temp[i].entityType == 'Group') {
          this.removeFromGroup(memberId);
        }
        else if (temp[i].entityType == 'Destination') {
          this.removeFromDestination(memberId);
        }
        // Remove from table
        temp.splice(i, 1);
      }
    }
    this.members = temp;
    this.f.members.setValue(this.members);
    this.dataSource = this.members;
    this.table.renderRows();
  }

  removeFromGroup(groupId) {
    for (let i = 0; i < this.groups.length; i++) {
      if (this.groups[i].groupId == groupId) {
        this.groups.splice(i, 1);
        return;
      }
    }
  }

  removeFromDestination(destinationId) {
    for (let i = 0; i < this.destinations.length; i++) {
      if (this.destinations[i].destinationId == destinationId) {
        this.destinations.splice(i, 1);
        return;
      }
    }
  }


  openDestinationPopUp() {

    // Set in Local Storage
    localStorage.setItem("selectedDests", JSON.stringify(this.destinations));
    localStorage.setItem("selectedGroups", JSON.stringify(this.groups));

    // Open Dialog
    const dialogRef = this.dialog.open(GroupDestDialogComponent, {
      disableClose: true,
      data: { type: '', screen:'Group', hideId:this.f.groupId.value }
    });

    // On close
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      console.log(dialogRef.componentInstance.groupSelection.selected);
      console.log(dialogRef.componentInstance.destinationSelection.selected);

      this.destinations = dialogRef.componentInstance.selectedDests;
      this.groups = dialogRef.componentInstance.selectedGrps;

      this.loadMembersTable();
      
    });
  }

  loadMembersTable() {
    this.members = [];
    // Load Groups
    for (let i = 0; i < this.groups.length; i++) {
      // Push to members table
      // this.f.type.value
      this.members.push(new GroupMember(this.f.groupId.value, this.f.groupName.value,
        this.groups[i].active,this.groups[i].type, this.groups[i].groupId, this.groups[i].groupName,
        'Group', this.f.escalationInterval.value, this.f.escalation.value, 0));
    }

    // Load Destinations
    for (let i = 0; i < this.destinations.length; i++) {
      // Push to members table
      this.members.push(new GroupMember(this.f.groupId.value, this.f.groupName.value,
        this.destinations[i].active,   this.destinations[i].type, this.destinations[i].destinationId, this.destinations[i].destinationName,
        'Destination', this.f.escalationInterval.value, this.f.escalation.value, 0));
    }

    this.dataSource = this.members;
    this.f.members.setValue(this.members);
    this.table.renderRows();
  }
  reset() {
    CommonService.resetPage(this.router);
  }

  get f() { return this.groupForm.controls; }

  dropTable(event: CdkDragDrop<GroupMember[]>) {
    const prevIndex = this.dataSource.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
    this.table.renderRows();
  }
}


// POJO's
class Destination {
  destinationId: Number;
  destinationName: any;
  active:Boolean;
  type:String
  constructor(destinationId: Number, destinationName : any,active:boolean,type:String) {
    this.destinationId = destinationId;
    this.destinationName = destinationName;
    this.active = active;
    this.type = type;
  }
}

class Group {
  groupId: Number;
  groupName : any;
  active:Boolean;
  type:String
  constructor(groupId: Number,groupName :any,active:boolean,type:String) {
    this.groupId = groupId;
    this.groupName = groupName;
    this.active = active;
    this.type = type;
    
  }
}

class GroupMember {
  groupId: Number;
  groupName: String;
  active: Boolean = false;
  type: String;
  entityId: Number;
  entityName: String;
  entityType: String;
  escalationInterval: Number;
  escalation: Boolean;
  escalationSequence: Number;

  constructor(groupId: Number, groupName: String, active: Boolean, type: String, entityId: Number, entityName: String, entityType: String, escalationInterval: Number, escalation: Boolean, escalationSequence: Number) {
    this.groupId = groupId;
    this.groupName = groupName;
    this.active = active;
    this.type = type;
    this.entityId = entityId;
    this.entityName = entityName;
    this.entityType = entityType;
    this.escalationInterval = escalationInterval;
    this.escalation = escalation;
    this.escalationSequence = escalationSequence;
  }

}
