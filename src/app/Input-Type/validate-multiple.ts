import { QuestionBase } from "./question-base";

import { FormGroup } from "@angular/forms";
import { Injectable } from "@angular/core";
/**
 * @author Tushar khairnar
 * @description  when screen with only checkboxes appears, we have validation that at least one checkbox is checked to move forword.
 * it belongs to single screen thats why declaired as service
 */

@Injectable()
export class MultipleChoiceVatidator{
constructor(){ console.log("MultipleChoiceVatidator")}
    
/**
 * @author Tushar khairnar
 * @description function check for at least checkbox is checked to  true and returns true, if no control found true, it will return false.
 */
validate( questions:Array<QuestionBase<any>>, form:FormGroup): boolean {     
        for (let i = 0; i < questions.length; i++) {
            if(form.controls[questions[i].key].value === true) {return true;}
        }
        return false;
    };
}