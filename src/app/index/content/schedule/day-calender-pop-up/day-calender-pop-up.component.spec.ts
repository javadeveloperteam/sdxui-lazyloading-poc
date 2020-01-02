import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayCalenderPopUpComponent } from './day-calender-pop-up.component';

describe('DayCalenderPopUpComponent', () => {
  let component: DayCalenderPopUpComponent;
  let fixture: ComponentFixture<DayCalenderPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayCalenderPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayCalenderPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
