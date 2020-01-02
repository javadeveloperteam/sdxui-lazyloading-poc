import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-messageblocking',
  templateUrl: './messageblocking.component.html',
  styleUrls: ['./messageblocking.component.css']
})
export class MessageblockingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('#timepicker1').datepicker();
    $('#timepicker2').datepicker();
  }

}
