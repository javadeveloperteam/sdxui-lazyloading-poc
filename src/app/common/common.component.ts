import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.css']
})
export class CommonComponent implements OnInit {

  @Input () showLoader : Boolean; 
  
  constructor() { }

  ngOnInit() {
  }

}
