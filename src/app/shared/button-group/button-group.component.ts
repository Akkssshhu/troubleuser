import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ButtonGroupComponent),
    multi: true
  }]
})
export class ButtonGroupComponent implements ControlValueAccessor {
  @Input() UserResponse: string
  @Output() sendResponse = new EventEmitter<string>();

  private _action: string;
  onchangefn = (_) => _

  constructor(private router: Router) { }

  @Input('valueSet') valueSet: Array<any>;
  ngOnInit() {
    console.log("UserResponse == ", this.UserResponse);
    console.log("valueSet == ", this.valueSet);
  }

  selectOption(res) {
    console.log("clicke =", res)
    this.sendResponse.emit(res)
    this.router.navigate(['troubleshoot', res])
  }

  get action() {
    return this._action;
  }

  set action(_action) {
    this._action = _action;
  }

  setAction(_action) {
    this.action = _action;
    this.onchangefn(this.action);
    // this.router.navigate([''])
    console.log(_action)
  }

  writeValue(obj: any): void {
    this.action = obj;
  }


  registerOnChange(fn: any): void {
    this.onchangefn = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }

}
