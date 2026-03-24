import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-third-step',
  standalone: true,
  imports: [],
  templateUrl: './third-step.html',
  styleUrl: './third-step.css',
})
export class ThirdStep {
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
}
