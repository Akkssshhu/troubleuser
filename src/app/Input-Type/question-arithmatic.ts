import { QuestionBase } from './question-base';
export class ArithmeticQuestion extends QuestionBase<string> {
  controlType = 'arithmetic';
  type: string;  
  constructor(options: {} = {}) {
      super(options);
      this.type = options['type'] || '';
  };
}
