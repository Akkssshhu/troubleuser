import { TestBed } from '@angular/core/testing';

import { ScreenJsonService } from './screen-json.service';

describe('ScreenJsonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScreenJsonService = TestBed.get(ScreenJsonService);
    expect(service).toBeTruthy();
  });
});
