import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageblockingComponent } from './messageblocking.component';

describe('MessageblockingComponent', () => {
  let component: MessageblockingComponent;
  let fixture: ComponentFixture<MessageblockingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageblockingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageblockingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
