import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventstatusComponent } from './eventstatus.component';

describe('EventstatusComponent', () => {
  let component: EventstatusComponent;
  let fixture: ComponentFixture<EventstatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventstatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
