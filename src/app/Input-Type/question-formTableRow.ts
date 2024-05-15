import { QuestionBase } from './question-base';
export class FormTableRow {
  label:string;
  key:string;
  elements: QuestionBase<any>[] = [];
  constructor() { }
}