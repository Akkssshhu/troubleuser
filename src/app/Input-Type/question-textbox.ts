import { QuestionBase } from './question-base';

export class TextboxQuestion extends QuestionBase<string> {
  controlType = 'text';
  type: string;
  /*
    minLength: string;
    maxLength: string; 
  */
  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  /*
  this.minLength = options['minLength'];
  this.maxLength = options['maxLength'];
  */
  }
}
