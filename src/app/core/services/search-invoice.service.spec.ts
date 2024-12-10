import { TestBed } from '@angular/core/testing';

import { SearchInvoiceService } from './search-invoice.service';

describe('SearchInvoiceService', () => {
  let service: SearchInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
