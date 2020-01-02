import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventvariableComponent } from './eventvariable.component';

describe('EventvariableComponent', () => {
  let component: EventvariableComponent;
  let fixture: ComponentFixture<EventvariableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventvariableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventvariableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
