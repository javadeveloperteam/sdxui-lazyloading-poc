import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetuserComponent } from './assetuser.component';

describe('AssetuserComponent', () => {
  let component: AssetuserComponent;
  let fixture: ComponentFixture<AssetuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
