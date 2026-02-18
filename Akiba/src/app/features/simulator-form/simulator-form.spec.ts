import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatorForm } from './simulator-form';

describe('SimulatorForm', () => {
  let component: SimulatorForm;
  let fixture: ComponentFixture<SimulatorForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulatorForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulatorForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
