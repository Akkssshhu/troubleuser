import { QuestionBase } from './question-base';

export class TableTextboxQuestion extends QuestionBase<string> {
  controlType = 'tableTextbox';
  type: string;
  constructor(options: {} = {}) {
      super(options);
      this.type = options['type'] || '';
  }
}
