import { QuestionBase } from './question-base';

export class DropdownQuestion extends QuestionBase<string> {
  controlType = 'option';
  options: {key: string, value: string, action:string, parentId:string }[] = [];
  media:[
  { ctype : string;
    curl : string;
    ctext : string;
    cFileName : string;
    cUniqueFileName : string;
    cDescription : string;
    cLanguage : string;
  }]
  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
