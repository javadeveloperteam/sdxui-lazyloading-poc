import { PipeTransform,Pipe  } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({name: 'datePipe'})
export class CustomDatePipe implements PipeTransform  {

  datePipe : DatePipe = new DatePipe('en-US');

  transform(items:any):any {
      // By default its showing the current offset with UTC value, hence double
     let timeOffset : string = '+'+-(new Date().getTimezoneOffset()*2 / 60);  
     return this.datePipe.transform(items,'medium',timeOffset);
  }
}

