import { QuestionBase } from './question-base';
import { FormTableRow } from './question-formTableRow';
export class MultiData extends QuestionBase<string> {
  controlType = 'multiData';
  noOfAssetsSold = 0;
  assetsSold=[];
  action:string;
  options: {key: string, value: string, action:string, parentId:string }[] = [];
  constructor(options: {} = {}){
      super(options);
      this.options = options['options'] || [];
  };
};