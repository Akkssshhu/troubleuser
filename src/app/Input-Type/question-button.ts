import { QuestionBase } from "./question-base";
export class ActionButton{
    controlType='button';
    action:string;
    label:String;
    elements: QuestionBase<any>[] = [];
    constructor(options: {} = {}){
      this.action=options['action'];
      this.label=options['label'];
    }
}