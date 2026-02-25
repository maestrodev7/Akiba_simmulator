import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SixthStep } from './sixth-step';

describe('SixthStep', () => {
  let component: SixthStep;
  let fixture: ComponentFixture<SixthStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SixthStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SixthStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
