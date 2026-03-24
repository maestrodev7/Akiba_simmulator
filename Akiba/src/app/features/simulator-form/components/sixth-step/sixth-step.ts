import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-sixth-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sixth-step.html',
  styleUrl: './sixth-step.css',
})
export class SixthStep {
  @Output() prev = new EventEmitter<void>();
  pay_method : "CARD"|"MOBILE"="CARD"
}
