import { Component, OnInit } from '@angular/core';
import { MessageService } from '../index/content/notificationstatus/services/message.service';
import { CommonService } from '../common/services/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-acknowledge',
  templateUrl: './acknowledge.component.html',
  styleUrls: ['./acknowledge.component.css']
})
export class AcknowledgeComponent implements OnInit {
  message: String = null
  messageId: String = null;
  showLoader = false;
  messageText = "";
  showPage = "errorPage";
  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute) {
    this.route.params.subscribe(params => this.message = params['message']);
  }

  ngOnInit() {
    this.showLoader = false;
    console.info(this.message);
    let message = atob(String(this.message));
    console.info(message);
    let messageArray = message.split('#');
    console.info(messageArray);
    if (messageArray[2] == 'update') {
      this.messageId = messageArray[0];
      if (this.messageId != null && this.messageId != undefined)
        this.showPage = "mainPage";
      else
        this.showPage = "errorPage";
    } else {
      this.showPage = "errorPage";
    }
  }

  updateMessageStatus(messageStatus: String) {
    this.showLoader = true;
    this.messageService.updateMessageStatus(this.messageId, messageStatus).subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        switch (res) {
          case "Acknowledged":
            this.messageText = "Your status has been changed to acknowledged!"
            break;
          case "NotAcknowledged":
            this.messageText = "Your status has been changed to not acknowledged! Will send the message to the next user";
            break;
          case "responded":
            this.messageText = "Already message has been ack/nack";
            break;
          case "expired":
            this.messageText = "The message as be expired";
            break;
          default:
            this.messageText = "The message as be expired";
            break;
        }
        this.showPage = "successPage";
        this.message = null;
        this.messageId = null;
      },
      err => {
        this.showLoader = false;
        console.log("Error occured");
        console.log(err['error']['message']);
        this.showPage = "errorPage";
      }
    );
  }

}
