export class QuestionBase<T>{
  
  value: T;
  key: string;
  label: string;
  description: string;
  requiredKey: boolean;
  order: number;
  controlType: string;
  parentId: string;
  formula:string[];
  minLength:number;
  maxLength:number;
  pattern:string;
  size:string;
  defaultValue:string;
  media:[{ctype : string;
  curl : string;
  ctext : string;
  cFileName : string;
  cUniqueFileName : string;
  cDescription : string;
  cLanguage : string;
  }]
  constructor(options: {
      value?: T,
      key?: string,
      label?: string,
      requiredKey?: boolean,
      order?: number,
      controlType?: string,
      parentId?: string;
      formula?:string[];
      minLength?:string;
      maxLength?:string;
      pattern?:string;
      size?:string;
      defaultValue?:string;
      media? : any;
      description? : string
    } = {}) {
      this.value = options.value;
      this.key = options.key || '';
      this.label = options.label || '';
      this.requiredKey = options.requiredKey;
      this.order = options.order === undefined ? 1 : options.order;
      this.controlType = options.controlType || '';
      this.parentId = options.parentId === "" ? "1" : options.parentId;
      this.formula = options.formula === undefined ? null : options.formula; 
      this.minLength = parseInt(options.minLength) || 1;
      this.maxLength = parseInt(options.maxLength)  || 256 ;
      this.pattern = options.pattern || '';
      this.size = options.size || "20"; // options.size || 'auto' //Text box size used inside table and constant table. 
      this.defaultValue=options.defaultValue;
      this.media = options.media;
      this.description = options.description;
  }
}