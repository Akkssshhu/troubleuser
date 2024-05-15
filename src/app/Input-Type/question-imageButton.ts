import { QuestionBase } from "./question-base";
export class ImageButton extends QuestionBase<string>{
    controlType='imageButton';
    action:string;
    elements: QuestionBase<any>[] = [];
    options: any;
    constructor(options: {} = {}){
      super(options);
      this.options = options['options'] || [];
      /* this.action=options['action'];
      this.label=options['label']; */
    }
}