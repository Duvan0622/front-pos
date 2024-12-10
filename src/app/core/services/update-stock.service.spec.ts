import { TestBed } from '@angular/core/testing';

import { UpdateStockService } from './update-stock.service';

describe('UpdateStockService', () => {
  let service: UpdateStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
