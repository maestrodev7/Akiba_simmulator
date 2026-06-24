import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-run-button',
  imports: [],
  templateUrl: './run-button.html',
  styleUrl: './run-button.css',
})
export class RunButton {
  @Input() label: string = "Commencer";
  @Output() clickEvent = new EventEmitter<void>();

  onClick() {
    this.clickEvent.emit();
  }
}
