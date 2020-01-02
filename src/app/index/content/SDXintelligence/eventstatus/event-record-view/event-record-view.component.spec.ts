import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRecordViewComponent } from './event-record-view.component';

describe('EventRecordViewComponent', () => {
  let component: EventRecordViewComponent;
  let fixture: ComponentFixture<EventRecordViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventRecordViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventRecordViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
