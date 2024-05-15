import { QuestionBase } from './question-base';
export class TableQuestion extends QuestionBase<string> {
  controlType = 'tableDisplay';
  options: {key: string, value: string, controlType: string, size:number; options:[{key: string, value: string}] }[] = [];
  dataEnteredElementsCount: number= 0;
  dataEntered= [];
  footer:[{operation:string,lable:string,column:string,value?:number}]
  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
    this.dataEnteredElementsCount = this.options.length;
    this.footer = options['footer'] ||[]
  };
}
