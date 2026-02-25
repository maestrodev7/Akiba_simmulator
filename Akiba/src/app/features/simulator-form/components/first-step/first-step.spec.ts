import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstStep } from './first-step';

describe('FirstStep', () => {
  let component: FirstStep;
  let fixture: ComponentFixture<FirstStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
