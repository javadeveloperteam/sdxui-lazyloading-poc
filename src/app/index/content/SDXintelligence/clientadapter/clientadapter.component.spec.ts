import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientadapterComponent } from './clientadapter.component';

describe('ClientadapterComponent', () => {
  let component: ClientadapterComponent;
  let fixture: ComponentFixture<ClientadapterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientadapterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientadapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
