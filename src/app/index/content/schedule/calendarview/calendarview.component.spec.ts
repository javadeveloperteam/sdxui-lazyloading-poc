import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarviewComponent } from './calendarview.component';

describe('CalendarviewComponent', () => {
  let component: CalendarviewComponent;
  let fixture: ComponentFixture<CalendarviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
