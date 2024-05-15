import { QuestionBase } from './question-base';
export class CheckBoxQuestion  extends QuestionBase<string> {
  public controlType = 'checkbox';
  public options: {key: string, value: boolean, action: string, parentId:string}[] = [];
  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
