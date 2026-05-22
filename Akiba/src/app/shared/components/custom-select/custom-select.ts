import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full" #container>
      <!-- Select Header -->
      <div 
        (click)="!isDisabled && toggleDropdown()"
        class="w-full p-3 bg-[#F5F5F5] border-2 border-gray-100 rounded-lg focus:border-[#56CB4E] outline-none transition-all cursor-pointer flex items-center justify-between pr-4 min-h-[52px]"
        [ngClass]="{'border-[#56CB4E]': isOpen, 'opacity-60 cursor-not-allowed': isDisabled}"
      >
        <div class="flex flex-wrap gap-1">
          <span *ngIf="!hasValue" class="text-gray-400">{{ placeholder }}</span>
          
          <ng-container *ngIf="!multiple && hasValue">
            <span class="text-gray-700">{{ selectedLabels[0] }}</span>
          </ng-container>

          <ng-container *ngIf="multiple && hasValue">
            <span *ngFor="let label of selectedLabels; let last = last" class="text-gray-700">
              {{ label }}{{ last ? '' : ',' }}
            </span>
          </ng-container>
        </div>

        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width="2" 
          stroke="#6B7280" 
          class="w-5 h-5 transition-transform duration-200"
          [style.transform]="isOpen ? 'rotate(180deg)' : 'rotate(0deg)'"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <!-- Dropdown -->
      <div 
        *ngIf="isOpen"
        class="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-fadeIn"
      >
        <div 
          *ngFor="let option of options"
          (click)="selectOption(option)"
          class="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <!-- Custom Checkbox (Visible in Multi-select) -->
          <div 
            *ngIf="multiple"
            class="w-5 h-5 rounded border flex items-center justify-center transition-all"
            [style.backgroundColor]="isSelected(option.value) ? '#5EC50A' : 'transparent'"
            [style.borderColor]="isSelected(option.value) ? '#5EC50A' : '#D1D5DB'"
          >
            <svg 
              *ngIf="isSelected(option.value)"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="white" 
              class="w-4 h-4"
            >
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>

          <span [ngClass]="{'font-semibold text-[#5EC50A]': !multiple && isSelected(option.value)}">
            {{ option.label }}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fadeIn {
      animation: fadeIn 0.15s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelect),
      multi: true
    }
  ]
})
export class CustomSelect implements ControlValueAccessor {
  @Input() options: { label: string, value: any }[] = [];
  @Input() placeholder: string = 'Sélectionner';
  @Input() multiple: boolean = false;

  selectedValue: any | any[] = null;
  isOpen: boolean = false;
  isDisabled: boolean = false;
  private elementRef = inject(ElementRef);

  onChange: any = () => {};
  onTouched: any = () => {};

  get hasValue(): boolean {
    if (this.multiple) {
      return Array.isArray(this.selectedValue) && this.selectedValue.length > 0;
    }
    return this.selectedValue !== null && this.selectedValue !== undefined && this.selectedValue !== '';
  }

  get selectedLabels(): string[] {
    if (!this.hasValue) return [];
    if (this.multiple) {
      return this.options
        .filter(opt => this.selectedValue.includes(opt.value))
        .map(opt => opt.label);
    }
    const option = this.options.find(opt => opt.value === this.selectedValue);
    return option ? [option.label] : [];
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.onTouched();
    }
  }

  selectOption(option: { label: string, value: any }) {
    if (this.multiple) {
      if (!Array.isArray(this.selectedValue)) {
        this.selectedValue = [];
      }
      const index = this.selectedValue.indexOf(option.value);
      if (index === -1) {
        this.selectedValue = [...this.selectedValue, option.value];
      } else {
        this.selectedValue = this.selectedValue.filter((v: any) => v !== option.value);
      }
    } else {
      this.selectedValue = option.value;
      this.isOpen = false;
    }
    
    this.onChange(this.selectedValue);
  }

  isSelected(value: any): boolean {
    if (this.multiple) {
      return Array.isArray(this.selectedValue) && this.selectedValue.includes(value);
    }
    return this.selectedValue === value;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  writeValue(value: any): void {
    if (!this.multiple && Array.isArray(value)) {
      const items = value
        .map((item) => (item != null ? String(item).trim() : ''))
        .filter((item) => item !== '');
      this.selectedValue = items.length > 0 ? items[0] : null;
      return;
    }
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
