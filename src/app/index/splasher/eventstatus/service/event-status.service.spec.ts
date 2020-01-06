import { TestBed } from '@angular/core/testing';

import { EventStatusService } from './event-status.service';

describe('EventStatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventStatusService = TestBed.get(EventStatusService);
    expect(service).toBeTruthy();
  });
});
