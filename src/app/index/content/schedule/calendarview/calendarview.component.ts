import {
	Component,
	ChangeDetectionStrategy,
	ViewChild,
	TemplateRef,
	OnInit,
	ViewEncapsulation
  } from '@angular/core';
  import {
	startOfDay,
	endOfDay,
	subDays,
	addDays,
	endOfMonth,
	isSameDay,
	isSameMonth,
	addHours,
	eachDay
  } from 'date-fns';
  import { Subject } from 'rxjs';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import {
	CalendarEvent,
	CalendarEventAction,
	CalendarEventTimesChangedEvent,
	CalendarView
  } from 'angular-calendar';
import { ScheduleService } from '../services/schedule.service';
import { MatDialog } from '@angular/material/dialog';
 import { LocationdialogComponent } from '../../SDXintelligence/asset/dialogbox/locationdialog/locationdialog.component';
import { CalendarPopupComponent } from '../calendar-popup/calendar-popup.component';
import { Helpers } from "src/app/helpers/helpers";
import { DayCalenderPopUpComponent } from '../day-calender-pop-up/day-calender-pop-up.component';

  const colors: any = {
	Red: {
	  primary: '#F14537',
	  secondary: '#F14537'
	},
	Blue: {
	  primary: '#60ACEF',
	  secondary: '#60ACEF'
	},
	Yellow: {
	  primary: '#F2F232',
	  secondary: '#F2F232'
	},
	Green: {
	  primary: '#8CF232',
	  secondary: '#8CF232'
	}
  };
@Component({
  selector: 'app-calendarview',
  templateUrl: './calendarview.component.html',
  styleUrls: ['./calendarview.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})

export class CalendarviewComponent implements OnInit {
	
	  
	@ViewChild('modalContent', {static : false}) modalContent: TemplateRef<any>;
	
	showLoader : Boolean ;
	userRole : any; 
	view: CalendarView = CalendarView.Month;
  
	CalendarView = CalendarView;
  
	viewDate: Date = new Date();
  
	  messageText = "";
	  message = false;
	  messageType = "";
  
	modalData: {
	  action: string;
	  event: CalendarEvent;
	};
  
	actions: CalendarEventAction[] = [
	  {
		label: '<i class="fa fa-fw fa-pencil"></i>',
		onClick: ({ event }: { event: CalendarEvent }): void => {
		  this.handleEvent('Edited', event);
		}
	  },
	  {
		label: '<i class="fa fa-fw fa-times"></i>',
		onClick: ({ event }: { event: CalendarEvent }): void => {
		  this.events = this.events.filter(iEvent => iEvent !== event);
		  this.handleEvent('Deleted', event);
		}
	  }
	];
  	refresh: Subject<any> = new Subject();
	events: CalendarEvent[] = [
	 /*  {
		start: new Date('2019-05-08T02:00:00'),
		end: new Date('2019-05-13T20:00:00'),
		title: 'week'
	  },
	  {
		start: new Date('2019-05-10T00:00:00'),
		end: new Date('2019-05-10T23:59:59'),
		title: 'Date'
	  } */
	];
  
	activeDayIsOpen: boolean = false;
	private subject = new Subject<any>();
	
	constructor(
	  private modal: NgbModal,
	  private scheduleService: ScheduleService, public dialog: MatDialog
	   ){}
  
	ngOnInit() {
	  this.userRole = Helpers.getUserRole();
	  this.showLoader = true;
	  this.loadCalendarEvents();
  }
  
	  loadCalendarEvents(){
		const tempEvents : CalendarEvent[] = [];
		this.scheduleService.getCalendarDetails().subscribe(
		  (eventList: Array<Object>) => {
			  console.log("Inside calendarEvent");
			  eventList.forEach(eventData => {
			  let eventObject = {start:new Date(eventData['start']),
							  end:new Date(eventData['end']),
							  title:eventData['title'],
							  color : colors[eventData['color']],
							  id:eventData['id'],
							  dispStartDate:new Date(eventData['dispStartDate']),
							  dispEndDate:new Date(eventData['dispEndDate']),
							  type:eventData['occurencetype']
							};
			  tempEvents.push(eventObject);
			});
			this.events = tempEvents;
			console.info(this.events);
			this.showLoader = false;
		  },
		  err => {
			  console.log("Error occured");
			 this.showMsg("USER/GROUP LOADING FAILED. KINDLY TRY AGAIN", 'danger');
			  this.showLoader = false;
		  }
		 );
	  }
  
	dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
	 const dialogRef = this.dialog.open(CalendarPopupComponent, { disableClose: true,data: {
		calenderData:events}
	 });

	 if (isSameMonth(date, this.viewDate)) {
		this.viewDate = date;
	  if(events.length === 0){
		  this.activeDayIsOpen = false;
	  }else{
		this.activeDayIsOpen = true;
	  }
	}else{
	  this.activeDayIsOpen = true;
	} 
	 /*  if (isSameMonth(date, this.viewDate)) {
		this.viewDate = date;
		if (
		  (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
		  events.length === 0
		) {
		  this.activeDayIsOpen = false;
		} else {
		  this.activeDayIsOpen = true;
		}
	  } */
	}
  
	eventTimesChanged({
	  event,
	  newStart,
	  newEnd
	}: CalendarEventTimesChangedEvent): void {
	  this.events = this.events.map(iEvent => {
		if (iEvent === event) {
		  return {
			...event,
			start: newStart,
			end: newEnd
		  };
		}
		return iEvent;
	  });
	  this.handleEvent('Dropped or resized', event);
	}
  
	handleEvent(action: string, event: CalendarEvent): void {
		console.log(action);
		console.log(event);
		const dialogRef = this.dialog.open(DayCalenderPopUpComponent, { disableClose: true,data: {
			calenderData:event}
		 });
		return;
		
	
	//   this.modalData = { event, action };
	//   this.modal.open(this.modalContent, { size: 'lg' });

	}
  
	addEvent(): void {
	  this.events = [
		...this.events,
		{
		  title: 'New event',
		  start: startOfDay(new Date()),
		  end: endOfDay(new Date()),
		  color: colors.red,
		  draggable: true,
		  resizable: {
			beforeStart: true,
			afterEnd: true
		  }
		}
	  ];
	}
  
	deleteEvent(eventToDelete: CalendarEvent) {
	  this.events = this.events.filter(event => event !== eventToDelete);
	}
  
	setView(view: CalendarView) {
	  this.view = view;
	}
  
	closeOpenMonthViewDay() {
	  this.activeDayIsOpen = false;
	}
  
	showMsg(message, type) {
	  window.scrollTo(0, 0);
	  this.messageText = message;
	  this.message = true;
	  this.messageType = type;
	  setTimeout(() => {
		  this.message = false;
	  }, 3000);
  }
}