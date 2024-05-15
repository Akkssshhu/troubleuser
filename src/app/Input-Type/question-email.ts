import { QuestionBase } from './question-base';

export class EmailboxQuestion extends QuestionBase<string> {
  controlType = 'mail';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
