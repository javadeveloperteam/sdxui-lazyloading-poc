import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationstatusComponent } from './notificationstatus.component';

describe('NotificationstatusComponent', () => {
  let component: NotificationstatusComponent;
  let fixture: ComponentFixture<NotificationstatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationstatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
