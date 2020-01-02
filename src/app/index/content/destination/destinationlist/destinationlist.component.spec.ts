import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationlistComponent } from './destinationlist.component';

describe('DestinationlistComponent', () => {
  let component: DestinationlistComponent;
  let fixture: ComponentFixture<DestinationlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinationlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
