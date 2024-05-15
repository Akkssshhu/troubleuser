import { QuestionBase } from './question-base';

export class RadioQuestion extends QuestionBase<string> {
  public controlType = 'radio';
  public options: {key: string, value: string, action: string, parentId:string}[] = [];
  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
