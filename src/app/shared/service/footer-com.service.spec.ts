import { TestBed } from '@angular/core/testing';

import { FooterComService } from './footer-com.service';

describe('FooterComService', () => {
  let service: FooterComService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FooterComService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
