import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "./services/message.service";
import { CommonService } from 'src/app/common/services/common.service';
import { GroupDestDialogComponent } from "../dialog/group-dest-dialog/group-dest-dialog.component";
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-sendmessage',
    templateUrl: './sendmessage.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./sendmessage.component.css']
})
export class SendmessageComponent implements OnInit {
    showLoader: boolean;
    messageForm: FormGroup;
    submitted: boolean;
    selectedFileList: File[];
    selectedDests: any = [];
    selectedGroups: any = [];
    constructor(
        public dialog: MatDialog,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private commonService: CommonService
    ) { }


    ngOnInit() {
        this.showLoader = false;
        this.submitted = false;
        this.selectedFileList = [];

        this.messageForm = this.formBuilder.group({
            subject: ['', Validators.required],
            message: ['', Validators.required],
            id: [null, Validators.required],
            attachements: [[]]
        });
    }

    // convenience getter for easy access to form fields
    get fn_message() { return this.messageForm.controls; }

  /*   onChangeType(type: any) {
        this.submitted = false;
        this.selectedGroups = [];
        this.selectedDests = [];
        const subject = this.messageForm.get('subject');
        subject.reset();
        switch (type) {
            case "Email":
                subject.setValidators([Validators.required]);
                break;

            case "SMS":
                subject.clearValidators();
                break;

            default:
                break;
        }
        subject.updateValueAndValidity();
        this.clearDataInJson();
    }
 */
    getFileDetails(e) {
        console.log('file data');
        console.log(e.target.files);
        // this.selectedFileList =[];
        for (let i = 0; i < e.target.files.length; i++) {
            if (this.fileNameNotAvailable(e.target.files[i].name)) {
                this.selectedFileList.push(e.target.files.item(i));
            }
        }
        /*   console.info(e);
          for (var i = 0; i < e.target.files.length; i++) {
              var name = e.target.files[i].name;
              var type = e.target.files[i].type;
              var size = e.target.files[i].size;
              var modifiedDate = e.target.files[i].lastModifiedDate;
              console.log('Name: ' + name + "\n" +
                  'Type: ' + type + "\n" +
                  'Last-Modified-Date: ' + modifiedDate + "\n" +
                  'Size: ' + Math.round(size / 1024) + " KB");
              console.log(e.target.files[i]);
          } */
    }

    fileNameNotAvailable(name: String): boolean {
        let flag: boolean = true;
        this.selectedFileList.forEach(file => {
            if (file.name == name)
                flag = false;
        });
        return flag;
    }

    onSubmit() {

        console.info("submit");
        this.submitted = true;
        console.info("Invaild::::" + this.messageForm.invalid);
        if (this.messageForm.invalid) {
            return;
        }
        this.showLoader = true;
        const messageFormBean = {};
        const selectedDestIds = [];
        const selectedGrpIds = [];
        this.selectedDests.forEach(obj => {
            selectedDestIds.push(obj['destinationId']);
        });

        this.selectedGroups.forEach(obj => {
            selectedGrpIds.push(obj['groupId']);
        });

        messageFormBean['destinationIds'] = selectedDestIds;
        messageFormBean['groupIds'] = selectedGrpIds;

        console.log('file List');
        console.log(this.selectedFileList);
        messageFormBean['messageContent'] = this.fn_message.message.value;
        messageFormBean['messageSubject'] = this.fn_message.subject.value;
        const formdata: FormData = new FormData();
        this.selectedFileList.forEach(file => {
            formdata.append('attachments', file);
            console.log(file);
        });
        formdata.append('messageFormBean', JSON.stringify(messageFormBean));
        console.info(formdata);
        this.messageService.SendMessage(formdata).subscribe(
            res => {
                this.showLoader = false;
                //need to move to common
                console.log(res);
                this.showMsg("Message Triggered Successfully", 'success');
                this.cancel();
                //this.clearDataInJson();
                //this.messageForm.reset();
                //this.clearUIValues()
                //this.router.navigate(['message']);
            },
            err => {
                this.showLoader = false;
                console.error(err);
                console.log("Error occured");
                console.log(err);
                this.showMsg("MESSAGE SENT FAILED : " + err.error.message, 'danger');
            }
        );
        //this.showLoader=false;
        //this.showMsg("SEND MESSAGE CALL INITIATED", 'success');
    }

    clearDataInJson() {
        this.selectedFileList = [];
    }

    clearUIValues() {
        this.submitted = false;
      //  this.messageForm.get('type').reset();
        this.messageForm.get('subject').reset();
        this.messageForm.get('message').reset();
        this.messageForm.get('attachements').reset();
        this.selectedGroups = [];
        this.selectedDests = [];
    }

    removeFile(deletedFile: File) {
        console.info("Remove file");
        const index: number = this.selectedFileList.indexOf(deletedFile);
        if (index !== -1) {
            this.selectedFileList.splice(index, 1);
        }
    }

    openDestinationPopUp() {

        // Set in Local Storage
        localStorage.setItem("selectedDests", JSON.stringify(this.selectedDests));
        localStorage.setItem("selectedGroups", JSON.stringify(this.selectedGroups));

        // Open Dialog
        const dialogRef = this.dialog.open(GroupDestDialogComponent, {
            disableClose: true,
            data: { type: ''}
        });

        // On close
        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
            console.log(dialogRef.componentInstance.groupSelection.selected);
            console.log(dialogRef.componentInstance.destinationSelection.selected);
            this.selectedDests = dialogRef.componentInstance.selectedDests;
            this.selectedGroups = dialogRef.componentInstance.selectedGrps;
            // Check if destination is selected
            if (this.selectedDests.length > 0 || this.selectedGroups.length > 0) {
                this.fn_message.id.setValue(1);
            }
            else
            {
                this.fn_message.id.setValue(null);
            }
        });
    }

    cancel(): void {
        console.info("reset");
        //this.router.navigate(['message']);
        this.clearDataInJson();
        this.selectedGroups = [];
        this.selectedDests = [];
        //this.clearUIValues()
        //this.submitted = false;
        this.ngOnInit();

    };

    showMsg(message, type) {
        this.commonService.openSnackBar(message, 'badge-' + type);
    }

    removeDestination(id) {
        for (let i = 0; i < this.selectedDests.length; i++) {
          if (this.selectedDests[i].destinationId == id) {
            this.selectedDests.splice(i, 1);
          }
        }
      }
    
      removeGroup(id) {
        for (let i = 0; i < this.selectedGroups.length; i++) {
          if (this.selectedGroups[i].groupId == id) {
            this.selectedGroups.splice(i, 1);
          }
        }
      }

}
