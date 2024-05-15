import { QuestionBase } from './question-base';
export class LableQuestion extends QuestionBase<string> {
  controlType = 'label';
  type: string;
  public action: string;
  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
    this.action =options['action'] || '';
  }
}
