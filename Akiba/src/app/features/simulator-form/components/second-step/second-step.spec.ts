import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondStep } from './second-step';

describe('SecondStep', () => {
  let component: SecondStep;
  let fixture: ComponentFixture<SecondStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
