import { QuestionBase } from './question-base';
import {FormTableRow} from './question-formTableRow';
export class ConstantTableQuestion extends QuestionBase<string> {
  controlType = 'constanttable';
  headings: {lebelId: number, label: string}[] = [];
  elements : FormTableRow [] = [];
  headingsElementsCount: number;
  constructor(options: {} = {}) {
    super(options);
    this.headings = options['headings'];
    this.elements = options['elements'];
  }

    generateControls(elements){

    }  
}
