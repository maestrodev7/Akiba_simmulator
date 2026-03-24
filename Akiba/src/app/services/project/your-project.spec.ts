import { TestBed } from '@angular/core/testing';

import { YourProject } from './your-project';

describe('YourProject', () => {
  let service: YourProject;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YourProject);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
