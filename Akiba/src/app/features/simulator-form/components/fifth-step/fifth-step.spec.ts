import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FifthStep } from './fifth-step';

describe('FifthStep', () => {
  let component: FifthStep;
  let fixture: ComponentFixture<FifthStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FifthStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FifthStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
