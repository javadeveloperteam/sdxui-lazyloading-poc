import { Component, OnInit, Input } from '@angular/core';

export class AlertMessageComponent {
  message: any;
  messageActive: boolean;

showSuccessMessage(message: string) {
    this.showMessage(message, 'success');
}

showFailureMessage(message: string) {
  this.showMessage(message, 'danger');
}

showMessage(msg: string, msgType: string) {
  this.messageActive = true;
  this.message = {};
  this.message.text = msg;
  this.message.type = msgType;
}

clearMessage() {
  this.messageActive = false;
}
}
