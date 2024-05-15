import { QuestionBase } from './question-base';
import { FormTableRow } from './question-formTableRow';
export class FormTableQuestion extends QuestionBase<string> {
  controlType = 'formTable';
  headings: {lebelId: number, label: string}[] = [];
  elements : FormTableRow [] = [];
  headingsElementsCount: number;
  label:string;


  constructor(options: {} = {}) {
      super(options);
      this.label = options['label'];
      this.headings = options['headings'];
      this.elements = options['elements'];
      this.headingsElementsCount = this.headings != undefined ? this.headings.length: 0;
  }
}
