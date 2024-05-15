
import { QuestionBase } from './question-base';
import { ActionButton } from './question-button'
export class Junction extends QuestionBase<string> {
  controlType = 'junction';
  headings: {lebelId: number, label: string}[] = [];
  elements : ActionButton[] = [];
  constructor(options: {} = {}, //elements: QuestionBase<any>[] = []
) {
      super(options);
      this.headings = options['headings'];
      this.elements = options['elements'];
      
  }

}
