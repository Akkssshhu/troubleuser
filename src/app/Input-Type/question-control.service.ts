import { Injectable }   from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from './question-base';
import { CheckBoxQuestion } from './question-checkbox';

@Injectable()
export class QuestionControlService {
constructor() { }

toFormGroup(questions: QuestionBase<any>[] ) {
    let group: any = {};
    questions.forEach(question => {
//group[question.key] = question.requiredKey === true ? new FormControl(question.value || '',Validators.required):new FormControl(question.value || '');
/*
let  formControl = new FormControl(question.value ||'');
if(question.minLength !== 0){
formControl.setValidators(Validators.minLength(question.minLength)) 
}
if(question.maxLength>0){
formControl.setValidators(Validators.minLength(question.minLength)) 
}
*/
/* group[question.key] = question.requiredKey === true ? new FormControl(question.value || '', [Validators.required,Validators.maxLength(question.maxLength),Validators.minLength(question.minLength)]):new FormControl(question.value || '',
                                                                                             [Validators.maxLength(question.maxLength),Validators.minLength(question.minLength)]);
 */
if(question instanceof CheckBoxQuestion){
   //let value = question.value=="true"?true:false;
    group[question.key] = new FormControl(question.value);
}else
 group[question.key] = new FormControl(question.value || '');
  });
  return new FormGroup(group);
  };

}
