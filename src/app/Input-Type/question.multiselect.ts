import { QuestionBase } from "./question-base";
import { FormTableRow } from "./question-formTableRow";
export class MultiSelect extends QuestionBase<string>{
    controlType='multiSelect';
    headings:{lebelId: number, label: string}[] = [];
    elements:FormTableRow [] = [];  
    headingsElementsCount: number;
    constructor(options: {} = {}){
        super(options);
        this.headings = options['headings'];
        this.elements = options['elements'];
        this.headingsElementsCount = this.headings != undefined ? this.headings.length: 0;
    }
}