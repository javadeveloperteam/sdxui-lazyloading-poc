import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationstatusWMSComponent } from './notificationstatus-wms.component';

describe('NotificationstatusWMSComponent', () => {
  let component: NotificationstatusWMSComponent;
  let fixture: ComponentFixture<NotificationstatusWMSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationstatusWMSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationstatusWMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
