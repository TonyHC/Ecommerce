import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

export function notOnlyWhiteSpace(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Check if string only contains whitespace, then return error object (invalid - custom validation error key) or return null (valid)
    return control.value != null && control.value.trim().length === 0
      ? { notOnlyWhiteSpace: true } : null;
  };
}

@Directive({
  selector: '[notOnlyWhiteSpace]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: notOnlyWhiteSpaceValidatorDirective,
    multi: true
  }]
})
export class notOnlyWhiteSpaceValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return notOnlyWhiteSpace()(control);
  }
}
