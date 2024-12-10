import { TestBed } from '@angular/core/testing';

import { StartSaleService } from './start-sale.service';

describe('StartSaleService', () => {
  let service: StartSaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StartSaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
