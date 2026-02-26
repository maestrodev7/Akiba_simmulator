import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-sixth-step',
  imports: [CommonModule],
  templateUrl: './sixth-step.html',
  styleUrl: './sixth-step.css',
})
export class SixthStep {
  pay_method : "CARD"|"MOBILE"="CARD"
}
