import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdStep } from './third-step';

describe('ThirdStep', () => {
  let component: ThirdStep;
  let fixture: ComponentFixture<ThirdStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThirdStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
