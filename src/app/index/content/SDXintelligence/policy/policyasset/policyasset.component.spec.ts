import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyassetComponent } from './policyasset.component';

describe('PolicyassetComponent', () => {
  let component: PolicyassetComponent;
  let fixture: ComponentFixture<PolicyassetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyassetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyassetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
