import { TestBed } from '@angular/core/testing';

import { Encyclopedia } from './encyclopedia.service';

describe('Encyclopedia', () => {
  let service: Encyclopedia;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Encyclopedia);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
