import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NbComponentSize } from '@nebular/theme';

type ButtonConfig = { label: string; value: any };

@Component({
  selector: 'ngx-button-group-control',
  templateUrl: './button-group-control.component.html',
  styleUrls: ['./button-group-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ButtonGroupControlComponent),
      multi: true,
    },
  ],
})
export class ButtonGroupControlComponent
  implements ControlValueAccessor, AfterViewInit {
  @Input()
  buttons: ButtonConfig[] = [];

  @Input()
  size: NbComponentSize = 'medium';

  private onChanges: (value: any) => void;
  private onTouched: (button: ButtonConfig) => void;

  buttonStates = [];
  disabled = false;

  constructor(private readonly cdRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  writeValue(value: any): void {
    const index = this.buttons.findIndex((button) => button.value === value);
    this.buttonStates.fill(false);
    this.buttonStates[index] = true;
    this.cdRef.detectChanges();
  }
  registerOnChange(fn: (value: any) => void): void {
    this.onChanges = fn;
  }
  registerOnTouched(fn: (button: ButtonConfig) => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  updateValue(index: number, pressedState: boolean, buttonValue: any) {
    if (this.onTouched) this.onTouched(this.buttons[index]);
    if (!pressedState) {
      if (this.buttonStates.every((state) => !state)) {
        this.buttonStates.fill(false);
        this.onChanges(null);
      }
      return;
    }
    this.buttonStates.fill(false);
    this.buttonStates[index] = true;
    this.onChanges(buttonValue);
  }
}
