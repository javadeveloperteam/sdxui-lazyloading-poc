import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleslistComponent } from './ruleslist.component';

describe('RuleslistComponent', () => {
  let component: RuleslistComponent;
  let fixture: ComponentFixture<RuleslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
