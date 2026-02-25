import { Component } from '@angular/core';
import { FirstStep } from "../first-step/first-step";
import { SecondStep } from "../second-step/second-step";
import { ThirdStep } from "../third-step/third-step";

@Component({
  selector: 'app-fifth-step',
  imports: [FirstStep, SecondStep, ThirdStep],
  templateUrl: './fifth-step.html',
  styleUrl: './fifth-step.css',
})
export class FifthStep {

}
