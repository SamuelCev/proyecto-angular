import { TestBed } from '@angular/core/testing';

import { Movements } from './movements';

describe('Movements', () => {
  let service: Movements;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Movements);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
