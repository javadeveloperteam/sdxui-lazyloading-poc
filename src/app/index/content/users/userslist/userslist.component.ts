import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { MatPaginator, MatSort, MatTableDataSource, MatTable, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { UsersService } from "../services/users.service";
//import { I18nComponent } from '../../../../shared/internationalization.component';
import { CommonService } from 'src/app/common/services/common.service';
import { DestinationService } from '../../destination/services/destination.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertPopupComponent } from '../modal/alert-popup/alert-popup.component';
import { Subscription } from 'rxjs';
import { ScheduleService } from '../../schedule/services/schedule.service';
//import { TranslateService } from '@ngx-translate/core';
//import { SharedService } from '../../../../shared/shared.service';
//import { CustomMatTableDataSource } from '../../../../paginator/custom-mat-table-datasource';
//import { CustomMatPaginatorComponent } from '../../../../paginator/custom-mat-paginator.component';
// declare let $: any;

@Component({
    selector: 'app-userslist',
    templateUrl: './userslist.component.html',
    styleUrls: ['./userslist.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class UserslistComponent implements OnInit {
    @ViewChild('modal1', { static: true }) modal1: ElementRef;
    @ViewChild('modal2', { static: true }) modal2: ElementRef;
    showLoader: Boolean = false;
    messageText = "";
    message = false;
    messageType = "";
    users: any;
    displayedColumns = ['userName', 'employeeId', 'emailId', 'mobileNo', 'active', 'action'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    destinationList: any;
    userId: any;
    deleteUserName: string;
    delUserId: number;


    constructor(
        private http: HttpClient,
        private router: Router,
        private usersService: UsersService,
        private scheduleService: ScheduleService,
        private destinationService: DestinationService,
        private commonService: CommonService, private modalService: NgbModal, public dialog: MatDialog, private userService: UsersService,
    ) {
    }

    ngOnInit() {

        this.showLoader = true;
        this.usersService.getAllUsers().subscribe(
            res => {
                this.showLoader = false;
                console.log(res);
                this.users = res;
                this.dataSource = new MatTableDataSource(this.users);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sortingDataAccessor = ((data, sortHeaderId) => {
                    if (typeof data[sortHeaderId] == 'string') {
                        return data[sortHeaderId].toString().toLowerCase();
                    }
                    else {
                        return data[sortHeaderId];
                    }
                });
                this.dataSource.sort = this.sort;
                this.dataSource.filterPredicate = function (data, filter: string): boolean {
                    return data.userName.toLowerCase().includes(filter);
                };
                // Retain Filter
                let searchFilter = $('#searchElement').val();
                if (searchFilter != null && searchFilter != '') {
                    this.applyFilter(searchFilter.toString());
                }

            },
            err => {
                this.showLoader = false;
                this.commonService.openSnackBar('User Load Failed', 'badge-danger');
                console.log("Error occured");
            }
        );

    }

    addUser(): void {
        this.router.navigate(['index/users/add']);
    };


    deleteUser(user: any) {
        this.showLoader = true;
        this.delUserId = user.userId
        this.deleteUserName = user.userName
        let destinationCount = 0;
        let scheduleCount = 0;
        this.destinationService.getDestinationList(user.userId).subscribe(
            res => {
                this.showLoader = false;
                this.destinationList = res;
                destinationCount = this.destinationList.length;

                // const dialogConfig = new MatDialogConfig();
                this.scheduleService.getAllScheduleByUser(user.userId).subscribe(
                    res => {
                        let scheduleList: any = res;
                        scheduleCount = scheduleList.length;
                        if (destinationCount > 0 || scheduleCount > 0) {
                            let content = 'This Account is Associated with below Entity(s):<br><br>';
                            if (destinationCount > 0) {
                                content += '<b>Contact(s):</b><br><ul>';
                                for (let i = 0; i < this.destinationList.length; i++) {
                                    content += '<li>' + this.destinationList[i].destinationName + '</li>';
                                }
                                content += '</ul><br>';
                            }
                            if (scheduleCount > 0) {
                                content += '<b>Schedule(s):</b><br><ul>';
                                for (let i = 0; i < scheduleList.length; i++) {
                                    content += '<li>' + scheduleList[i].scheduleName + '</li>';
                                }
                                content += '</ul><br>';
                            }

                            content += 'Kindly Delete the Associated Entity(s) and Try Again';

                            const dialogRef = this.dialog.open(AlertPopupComponent, {
                                disableClose: true, data: {
                                    type: "alert",
                                    deleteId: this.delUserId,
                                    deleteUserName: this.deleteUserName,
                                    component: 'user',
                                    content: content
                                }
                            });

                        } else {
                            const dialogRef = this.dialog.open(AlertPopupComponent, {
                                disableClose: true, data: {
                                    type: "submit",
                                    component: 'user',
                                    content: 'User <b>"' + this.deleteUserName + '"</b> will be Removed Permanently. Do you want to Proceed ?'
                                }
                            });
                            dialogRef.afterClosed().subscribe(result => {
                                if (dialogRef.componentInstance.isDelete == true) {
                                    this.showLoader = true;

                                    this.usersService.deleteUser(this.delUserId).subscribe(
                                        res => {
                                            this.showLoader = false;
                                            this.commonService.openSnackBar('User - ' + this.deleteUserName + ' Deleted Successfully', 'badge-success');
                                            this.ngOnInit()

                                        },
                                        err => {
                                            this.showLoader = false;
                                            this.commonService.openSnackBar('User Delete Failed', 'badge-danger');

                                        }
                                    );
                                }



                            })

                        }
                    });
            },
            err => {
                this.showLoader = false;
                this.commonService.openSnackBar('Request Failed', 'badge-danger');
                console.log("Error occured");

            }
        )



    }
    statusUpdate(user: any) {
        // update contact
        user.active = !user.active;
        this.updateUser(user);
    }
    updateUser(user) {
        this.showLoader = true;
        // const userList: FormData = new FormData()
        // userList = user
        const formData: FormData = new FormData();
        // Remove Date fields due to form data
        delete user['createdOn'];
        delete user['modifiedOn'];
        delete user['pwdChangeDate'];
        delete user['tokenKeyExpiryDate'];

        formData.append('user', JSON.stringify(user));

        this.userService.updateUser(formData).subscribe(
            res => {
                this.showLoader = false;
                console.log(res);
                this.commonService.openSnackBar('User - ' + name + ' Updated Successfully', 'badge-success');
                this.ngOnInit();
            },
            err => {
                this.showLoader = false;
                console.error(err);
                this.commonService.openSnackBar('User Update Failed : ' + err.error.message, 'badge-danger');
            }
        );
    }

    editUser(user: any) {
        this.showLoader = true;
        this.router.navigate(['index/users/edit']);
        localStorage.setItem("editUser", JSON.stringify(user));
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

}
