import { Component, OnInit } from '@angular/core';
import { QuestionBase } from '../../Input-Type/question-base';
import { FormGroup, FormControl, NgForm, FormGroupDirective, Validators, FormBuilder } from '@angular/forms';
import { TableQuestion } from '../../Input-Type/question-table';
import { ConstantTableQuestion } from '../../Input-Type/question-constanttable';
import { QuestionControlService } from '../../Input-Type/question-control.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ScreenJsonService } from '../../services/screen-json.service';
import { MultipleChoiceVatidator } from '../../Input-Type/validate-multiple';
import { DomSanitizer } from '@angular/platform-browser';
import { QUESTION_TYPE } from '../../Input-Type/question-type';
import { RadioQuestion } from '../../Input-Type/question-radio';
import { CheckBoxQuestion } from '../../Input-Type/question-checkbox';
import { DropdownQuestion } from '../../Input-Type/question-dropdown';
import { TextboxQuestion } from '../../Input-Type/question-textbox';
import { ArithmeticQuestion } from '../../Input-Type/question-arithmatic';
import { TextAreaQuestion } from '../../Input-Type/question-textarea';
import { DateQuestion } from '../../Input-Type/question-date';
import { LableQuestion } from '../../Input-Type/question-label';
import { EmailboxQuestion } from '../../Input-Type/question-email';
import { environment } from 'src/environments/environment';
import { SCRUTINY_TYPE } from '../../Input-Type/constant-types';
import { ImageButton } from '../../Input-Type/question-imageButton';
import { ActionButton } from '../../Input-Type/question-button';
import { MultiData } from '../../Input-Type/question-multiAssetsSold';
import { UtilsService } from '../../services/utils.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-troubleshoot',
  templateUrl: './troubleshoot.component.html',
  styleUrls: ['./troubleshoot.component.scss'],
  providers: [QuestionControlService, ScreenJsonService, MultipleChoiceVatidator, UtilsService],
})
export class TroubleshootComponent implements OnInit {

  customOptions: OwlOptions = {
    items: 1,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    autoWidth: false,
    // navText: ['', ''],
    /* responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    }, */
    nav: false
  }
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;


  questions: QuestionBase<any>[] = [];
  form: FormGroup;
  dynamicTable: FormGroup = null;
  constantTable: FormGroup = null;
  isDisabled = true;
  payLoad: Array<any> = [];
  formNextAction: string;
  formPrevAction: String;
  tableData: TableQuestion;
  constantTableData: ConstantTableQuestion = new ConstantTableQuestion();
  errorMessage: string | null;
  // matcher = new MyErrorStateMatcher();
  multipartInput: any;
  formId: string | null;
  formLabel: string;
  tableLabel: string;
  constantTableLabel: string;
  //assesseType: string;
  formFormulaList = [];
  receivedNewScreen: boolean;
  helpContent
  hideHelpContent = false;
  validForm    // validForm it must not be initialized  true or false
  formLevelValidationMessage = ''; categoryId: any;
  taxQueryId: string = '';
  userId: string = "100";
  validDynamicTable;
  validConstantTable;
  formType: string;
  scrutinyType: string;
  scrutiny: any;
  currentQuestion: any = {};
  visitedData: any = [];
  /**
   * show scrutiny data payload in dev envirment and hides in production envirment.
   */
  showPayload: boolean = !(environment.production);
  mediaArray = [];
  currentMedia: any;
  currentIndex = 0
  nextActionFromChild: string = '';
  treeId: any;
  description: string;
  onlyImage = [];
  onlyDocument = [];
  onlyVideo = []
  problemName: any;
  constructor(private _formBuilder: FormBuilder,
    private qcs: QuestionControlService,
    private router: Router,
    private route: ActivatedRoute,
    public screenJsonService: ScreenJsonService,
    private multipleChoiceVatidator: MultipleChoiceVatidator,
    public utilsService: UtilsService,
    private sanitizer: DomSanitizer) {

    this.route.params.subscribe(routeParams => {
      this.categoryId = routeParams.id
      console.log("this.categoryId = ", this.categoryId)
    })
    this.scrutiny = '';// JSON.parse(sessionStorage.getItem('SCRUTINY_DATA'));
    /**
    * @constant SCRUTINY_DATA
    * @description Scrutiny data payload hold detailed payload and contains data which is get from the server and post to the server
    */
    this.multipartInput = null;
    sessionStorage.setItem('saveUpdateParam', '');
    sessionStorage.setItem('SCRUTINY_CURRENT_POSITION', "0")
  };

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    window.scrollTo(0, 0)


    this.problemName = JSON.parse(sessionStorage.getItem('BREAD_CRUMB')).filter(item => item.type == "")
    console.log("troubleshoot under problem = ", this.problemName)
    if (this.categoryId !== null && this.categoryId !== undefined && this.categoryId !== "") {
      console.log("in onInit")
      this.navigateToPage(this.categoryId);
    }
    this.form = this.qcs.toFormGroup(this.questions);
    let group: any = {};
    this.dynamicTable = new FormGroup(group);
    this.constantTable = new FormGroup(group);
    this.treeId = JSON.parse(sessionStorage.getItem('TREE_ID'))
    console.log("JSON.parse(sessionStorage.getItem('SIDE_DATA')) ", JSON.parse(sessionStorage.getItem('SIDE_DATA')))
    this.visitedData = this.utilsService.isNonEmpty(JSON.parse(sessionStorage.getItem('SIDE_DATA'))) ? JSON.parse(sessionStorage.getItem('SIDE_DATA')) : []
    this.visitedData = this.visitedData.filter(item => item.question.treeId == this.treeId)
    sessionStorage.setItem('SIDE_DATA', JSON.stringify(this.visitedData))
  };

  getResponse(event) {
    console.log("response in parent ", event)
    this.formNextAction = event
  }
  /*   nextMedia() {
      if (this.currentIndex < this.currentQuestion.media.length - 1) {
        this.currentIndex = this.currentIndex + 1;
        console.log(this.currentIndex)
        const media = this.currentQuestion.media[this.currentIndex]
        this.currentMedia = media.curl
      }
    } */

  /*   prevMedia() {
      if (this.currentIndex > 0) {
        this.currentIndex = this.currentIndex - 1;
        console.log(this.currentIndex)
        const media = this.currentQuestion.media[this.currentIndex]
        this.currentMedia = media.curl
      }
    } */

  previousPage() {
    /** while user choose to go back from bank screen */
    if (this.formId == "ESHQ00001") {
      this.router.navigate["/sars"];
    } else
      if (this.validateScreen()) {
        this.validForm = true;
        this.saveAndNavigate('prev')
      } else {
        this.validForm = false;
      }
  };

  /**
   * @author Tushar khairnar
   * @description Here all form groups are validated and on there validation state navigation is controlled.
   */
  validateScreen(): boolean {
    let valid: boolean = false;
    if (this.form.status !== undefined) {
      if (this.form.status === 'VALID') {
        valid = true;
      }
      if (this.dynamicTable != undefined) {
        console.log("This screen has table")
      }
      if (this.form.status === 'VALID' && this.dynamicTable != undefined) {

        valid = this.validateTableState();
      }
      if (this.constantTable != undefined) {
        console.log("This screen has constant table")
      }
      if (this.form.status === 'VALID' && this.constantTable != undefined) {
        valid = this.validateConstantTableState();
      }
    }
    return valid;
  }

  nextPage() {
    this.utilsService.openLoaderDialog();
    console.log("currentQuestion ", this.currentQuestion);
    if (this.formNextAction && this.formNextAction !== null && this.formNextAction !== '' && this.formNextAction !== undefined) {
      if (this.formType == QUESTION_TYPE.multiSelect) {
        if (this.multipleChoiceVatidator.validate(this.questions, this.form)) {
          this.saveAndNavigate('next');
        } else {
          alert("You must select checkbox's given on form")
        }
      }
      else if (this.validateScreen()) {
        this.validForm = true;
        this.saveAndNavigate('next')
      }
    }
    else {
      this.utilsService.dialogRef.close()
      this.validForm = false;
    }
  };

  validateTableState(): boolean {
    this.validDynamicTable
    if (this.dynamicTable != undefined) {
      if (this.dynamicTable.status === 'VALID') { this.validDynamicTable = true; } else { this.validDynamicTable = false; }
    }
    return this.validDynamicTable;
  };


  validateConstantTableState(): boolean {
    if (this.constantTable != undefined) {

      if (this.constantTable.status === 'VALID') {
        this.validConstantTable = true;

      } else {
        this.validConstantTable = false;
      }

    }
    return this.validConstantTable;
  };

  storingInformation: boolean;
  /**
   * @author Tushar & Manoj
   * @description
   * */
  saveAndNavigate(direction) {
    this.utilsService.dialogRef.close()
    this.storingInformation = true;
    let action = null;
    this.errorMessage = '';
    let i: number;
    let generatedData: any = {};
    this.validDynamicTable = false;
    this.validConstantTable = false;
    //This generatedData data object will contain data for post request
    generatedData.allDataObj = [];
    generatedData.parentId = this.formPrevAction;
    for (i = 0; i < this.questions.length; i++) {
      if (this.questions[i].controlType === QUESTION_TYPE.radio) {
        let selectedRadio = (<RadioQuestion>this.questions[i]);
        // let selectionRadioValue = this.form.controls[selectedRadio.key].value;
        let selectionRadioValue = this.formNextAction;
        // Pass selected value to action
        if (direction == 'prev') { action = selectedRadio.parentId; }
        else { action = selectionRadioValue; }
        // generate keys for post request
        generatedData.parentId = selectedRadio.parentId;

        if (this.formId == "") { generatedData.key = selectedRadio.key; }
        let data: any = {};
        data.key = selectedRadio.key;
        data.value = selectionRadioValue;
        generatedData.allDataObj.push(data);
        generatedData.action = action;
      } else if (this.questions[i].controlType === QUESTION_TYPE.checkbox) {
        let selectedCheckbox = (<CheckBoxQuestion>this.questions[i]);
        console.log("selectedCheckbox = ", selectedCheckbox)
        let selectionCheckboxValue = this.form.controls[selectedCheckbox.key].value;
        // generate keys for post request
        generatedData.parentId = this.formPrevAction;
        let data: any = {};
        data.key = selectedCheckbox.key;
        data.value = (selectionCheckboxValue == true ? "true" : "false");
        let returnData = this.updateStoredValue(data.key, selectionCheckboxValue);
        if (returnData == '') { generatedData.allDataObj.push(data) };
        if (this.formNextAction !== "")
          this.navigateToPage(this.formNextAction);
        this.formNextAction = "";
      }
      else if (this.questions[i].controlType === QUESTION_TYPE.option) {
        let selectedDropdown = (<DropdownQuestion>this.questions[i]);
        let selectedDropdownValue = this.form.controls[selectedDropdown.key].value;
        let iOptions: number;
        /*  for (iOptions = 0; iOptions < selectedDropdown.options.length; iOptions++) {
           if (selectedDropdown.options[iOptions].key === selectedDropdownValue) {
             action = selectedDropdown.options[iOptions].action;
             console.log("option action == ", action)
             break;
           }
         } */
        action = this.formNextAction
        if (direction == 'prev') { action = selectedDropdown.parentId; }
        generatedData.parentId = selectedDropdown.parentId;
        if (this.formId == "") { generatedData.key = selectedDropdown.key; }
        let data: any = {};
        data.key = selectedDropdown.key;
        data.value = selectedDropdownValue;
        generatedData.action = action;

        let returnData = this.updateStoredValue(selectedDropdown.key, selectedDropdownValue);
        if (returnData == '') {
          generatedData.allDataObj.push(data);
        }
      }
      else if (this.questions[i].controlType === QUESTION_TYPE.text) {
        let textField = (<TextboxQuestion>this.questions[i]);

        let data: any = {};
        data.key = textField.key;
        data.value = this.form.controls[textField.key].value;
        let returnData = this.updateStoredValue(textField.key, this.form.controls[textField.key].value);

        if (returnData == '') {
          generatedData.allDataObj.push(data);
        }
      } else if (this.questions[i].controlType === QUESTION_TYPE.arithmetic) {
        let ArithField = (<ArithmeticQuestion>this.questions[i]);
        let data: any = {};
        data.key = ArithField.key;
        data.value = this.form.controls[ArithField.key].value;
        let returnData = this.updateStoredValue(ArithField.key, this.form.controls[ArithField.key].value);
        if (returnData == '') {
          generatedData.allDataObj.push(data);
        }
      } else if (this.questions[i].controlType === QUESTION_TYPE.textarea) {
        let textField = (<TextAreaQuestion>this.questions[i]);
        let data: any = {};
        data.key = textField.key;
        data.value = this.form.controls[textField.key].value;
        let returnData = this.updateStoredValue(textField.key, this.form.controls[textField.key].value);
        if (returnData == '') {
          generatedData.parentId = this.questions[i].parentId;
        }
      } else if (this.questions[i].controlType === QUESTION_TYPE.date) {
        let dateField = (<DateQuestion>this.questions[i]);
        let data: any = {};
        data.key = dateField.key;
        data.value = this.form.controls[dateField.key].value;
        let returnData = this.updateStoredValue(dateField.key, this.form.controls[dateField.key].value);
        if (returnData == '') {
          generatedData.allDataObj.push(data);
        }
      }
      else if (this.questions[i].controlType === QUESTION_TYPE.label) {
        let labelField = (<LableQuestion>this.questions[i]);

        let data: any = {};
        data.key = labelField.key;
        data.value = this.form.controls[labelField.key].value;
        generatedData.allDataObj.push(data);
      }
      else if (this.questions[i].controlType === QUESTION_TYPE.mail) {
        let textField = (<EmailboxQuestion>this.questions[i]);
        let data: any = {};
        data.key = textField.key;
        data.value = this.form.controls[textField.key].value;
        generatedData.allDataObj.push(data);
      }
      else if (this.questions[i].controlType === 'tableDisplay') {
        if (this.dynamicTable !== undefined) {
          let tableData = (<TableQuestion>this.questions[i]);
          let data: any = {};
          let tableValues = [];
          data.key = tableData.key;

          for (let key in this.dynamicTable.value) {
            let tableValue: any = {};
            tableValue.key = key;
            tableValue.value = this.dynamicTable.value[key];
            tableValues.push(tableValue);
          }
          data.tableValue = tableValues;
          let returnData = this.updateStoredTableValue(tableData.key, tableValues);
          if (returnData == '') {
            generatedData.allDataObj.push(data);
          }
          generatedData.parentId = this.formPrevAction;
        }
      }
      else if (this.questions[i].controlType === QUESTION_TYPE.constanttable) {
        if (this.constantTable !== undefined) {
          let formConstantTableData = (<ConstantTableQuestion>this.questions[i]);
          let data: any = {};
          let tableValues = [];

          data.key = formConstantTableData.key;
          data.constTableValue = [];

          for (let key in this.constantTable.value) {
            let tableValue: any = {};
            tableValue.key = key;
            tableValue.value = this.constantTable.value[key];
            tableValues.push(tableValue);
          }
          data.constTableValue = tableValues;
          let returnData = this.updateStoredConstTableValue(formConstantTableData.key, tableValues);
          if (returnData == '') {
            generatedData.allDataObj.push(data);
          }
        }
      } else if (this.questions[i].controlType === QUESTION_TYPE.imageButton) {
        if (this.formNextAction !== "")
          this.navigateToPage(this.formNextAction);
        this.formNextAction = "";
      } else if (this.questions[i].controlType === QUESTION_TYPE.htmlText) {
        if (this.formNextAction !== "")
          this.navigateToPage(this.formNextAction);
        this.formNextAction = "";
      }
    }
    let SCRUTINY_CURRENT_POSITION = parseInt(sessionStorage.getItem('SCRUTINY_CURRENT_POSITION'));
    if (direction == 'prev') {
      if (this.formPrevAction != '') {
        action = this.formPrevAction;
        if (this.formPrevAction) {
          let _index = this.formPrevAction.indexOf("_");
          if (_index !== -1) {
            let substr_start = this.formPrevAction.substring(0, _index);
            let temp = this.formPrevAction.substring(_index, this.formPrevAction.length);
            let SCRUTINY_REASONS_STATUS: ScrutinyReasonsStatus[] = []
            if (SCRUTINY_CURRENT_POSITION != 0) {
              SCRUTINY_CURRENT_POSITION = SCRUTINY_CURRENT_POSITION - 1;
              this.formPrevAction = SCRUTINY_REASONS_STATUS[SCRUTINY_CURRENT_POSITION].startAction;
            } else {
              // if 0 index
              if (this.payLoad.length > 0) {
                this.payLoad.forEach((obj) => {
                  // if action of object found is parentId ending with start or end go to that action
                  if (obj.action == 'commonend') {
                    this.formPrevAction = obj.key;
                  }
                });
              }
            }
          }
        }
        // }else{
        sessionStorage.setItem('SCRUTINY_CURRENT_POSITION', SCRUTINY_CURRENT_POSITION.toString());
        action = this.formPrevAction;
        //}
      }
    } else if (direction == 'next') {
      if (this.formNextAction != '') {
        if (this.formType === QUESTION_TYPE.form) {
          if (this.formNextAction === 'commonend') {
            switch (this.scrutinyType) {
              case SCRUTINY_TYPE.complete: {
                this.router.navigate(['annexure/executivecontct']);
                return;
              }
              case SCRUTINY_TYPE.Compulsory: {
                this.router.navigate(['annexure/executivecontct']);
                return;
              }
              case SCRUTINY_TYPE.limited: {
                let SCRUTINT_REASONS_STATUS: ScrutinyReasonsStatus = JSON.parse(sessionStorage.getItem('SCRUTINY_REASONS_STATUS'));
                this.formNextAction = "commonend";
                sessionStorage.setItem('SCRUTINY_CURRENT_POSITION', "0");
                break;
              }
            }
          } else {
            let _index = this.formNextAction.indexOf("_");
            if (_index !== -1) {
              let SCRUTINY_REASONS_STATUS: ScrutinyReasonsStatus[] = JSON.parse(sessionStorage.getItem('SCRUTINY_REASONS_STATUS'));
              let substr_end = this.formNextAction.substring(0, _index);
              let temp = this.formNextAction.substring(_index, this.formNextAction.length);
              let _reasonIndex = 0;

              for (_reasonIndex = 0; _reasonIndex <= SCRUTINY_REASONS_STATUS.length; _reasonIndex++) {
                if (SCRUTINY_REASONS_STATUS[_reasonIndex].startAction == substr_end) {
                  SCRUTINY_REASONS_STATUS[_reasonIndex].endId = substr_end;
                  break;
                }
              }
              sessionStorage.setItem('SCRUTINY_REASONS_STATUS', JSON.stringify(SCRUTINY_REASONS_STATUS));
              // assigned start point from next element
              if (_reasonIndex < SCRUTINY_REASONS_STATUS.length - 1 && _reasonIndex !== SCRUTINY_REASONS_STATUS.length - 1) {
                if (SCRUTINY_REASONS_STATUS[_reasonIndex + 1].startAction !== '' && (SCRUTINY_REASONS_STATUS[_reasonIndex + 1].implementStatus === 'Y' && SCRUTINY_REASONS_STATUS[_reasonIndex + 1].knownFlag == 'Y')) {
                  this.formNextAction = SCRUTINY_REASONS_STATUS[_reasonIndex + 1].startAction;
                  sessionStorage.setItem('SCRUTINY_CURRENT_POSITION', (_reasonIndex + 1).toString());
                } else if (SCRUTINY_REASONS_STATUS[_reasonIndex + 1].implementStatus === 'N' && SCRUTINY_REASONS_STATUS[_reasonIndex + 1].knownFlag == 'Y') {
                  // Return here to avoid sevice call
                  this.router.navigate(['annexure']);
                  alert('Not Implemented or Annexure Required');
                  return;
                } else if (SCRUTINY_REASONS_STATUS[_reasonIndex + 1].implementStatus === 'N' && SCRUTINY_REASONS_STATUS[_reasonIndex + 1].knownFlag == 'N') {
                  this.router.navigate(['annexure/executivecontct']);
                  alert('Not Implemented or Not know');
                  return;
                }
              }
              else {
                // must return because flow ends
                this.formNextAction = substr_end;
                alert("will route to annexure");
                //  return;
              }
            }
          }
        }
        console.log("this.formNextAction == ", this.formNextAction);
        action = this.formNextAction;
      }
    }
    if (this.formId !== "" && this.formPrevAction !== "0") {
      generatedData.key = this.formId;
      generatedData.action = this.formNextAction;
    }
    this.pushOrUpdate(generatedData);
    if (this.formType === QUESTION_TYPE.junction) {
      console.log("fetch value from payload");
      console.log("##########################", this.payLoad);
      for (let i = 0; i < this.payLoad.length - 1; i++) {
        console.log(this.payLoad[i].key)
        console.log("FormId", this.formId)
        if (this.payLoad[i].key == this.formId) {
          console.log("this.payLoad == ", this.payLoad);
        }
      }
    }
    // conditons start && end
    if (this.form.status == 'VALID') {
      if (this.currentQuestion.elements[0].optionType === 'checkbox' ||
        this.currentQuestion.elements[0].optionType === 'htmlText') {
        this.saveData(this.currentQuestion, this.currentQuestion.elements[0].nextAction);
      } else {
        this.saveData(this.currentQuestion, this.categoryId);
      }
      // if (action !== 'End' && action !== null && action != "" && action != '0' && action != 'Edit') {
      this.navigateToPage(action, direction);
      // }
    }
    console.log("this.vistedData ", this.visitedData)
    window.scrollTo(0, 0);
  };

  pushOrUpdate(data) {
    let foundObject = false;
    this.payLoad.forEach(allObj => {
      if (allObj.parentId == data.parentId && allObj.key == data.key) {
        foundObject = true;
      }
    });
    if (!foundObject) {
      if (data.allDataObj.length > 0)
        this.payLoad.push(data);
    }
    console.log("this.payLoad == ", this.payLoad);
  };

  getStoredValue(keyToSearch) {
    let dataFound = '';
    this.payLoad.forEach(allObj => {
      allObj.allDataObj.forEach(page => {
        if (page.key == keyToSearch) {
          dataFound = page.value;
        }
      })
    });
    return dataFound + '';
  };

  getStoredTableData(keyToSearch) {
    let dataFound = '';
    this.payLoad.forEach(allObj => {
      allObj.allDataObj.forEach(page => {
        if (page.key == keyToSearch) {
          dataFound = page.tableValue;
        }
      })
    });
    return dataFound;
  };

  getStoredConstTableData(keyToSearch) {
    let dataFound = '';
    this.payLoad.forEach(allObj => {
      allObj.allDataObj.forEach(page => {
        if (page.key == keyToSearch) {
          dataFound = page.constTableValue;
        }
      })
    });
    return dataFound;
  };

  getStoredTableValue(keyToSearch, constTableDataArray) {
    let dataFound = '';
    if (constTableDataArray.length > 0) {
      constTableDataArray.forEach(allObj => {
        if (allObj.key == keyToSearch) {
          dataFound = allObj.value;
        }
      });
    }
    return dataFound;
  };

  updateStoredValue(keyToChange, value) {
    let dataFound = '';
    this.payLoad.forEach(allObj => {
      allObj.allDataObj.forEach(page => {
        if (page.key == keyToChange) {
          page.value = value;
          dataFound = 'found';
        }
      })
    });
    return dataFound;
  };

  updateStoredTableValue(keyToChange, value) {
    let dataFound = '';
    this.payLoad.forEach(allObj => {
      allObj.allDataObj.forEach(page => {
        if (page.key == keyToChange) {
          page.tableValue = value;
          dataFound = 'found';
        }
      })
    });
    return dataFound;
  };

  updateStoredConstTableValue(keyToChange, value) {
    let dataFound = '';
    this.payLoad.forEach(allObj => {
      allObj.allDataObj.forEach(page => {
        if (page.key == keyToChange) {
          page.constTableValue = value;
          dataFound = 'found';
        }
      })
    });
    return dataFound;
  };

  /**
  * @function navigateToPage
  * @param action
  * @description This function is used to  receive data from http JSON service.
  *              It takes one parameter which is an action value representing query param 'question number' of http JSON service call.
  * @author Tushar Khairnar & Sir Manoj
  */
  navigateToPage(action, direction?: string) {
    this.onlyImage = [];
    this.onlyVideo = [];
    this.onlyDocument = [];
    this.utilsService.openLoaderDialog();
    console.log("action = ", action)
    let responseArray = [];
    let questionsTemp = [];
    let contentId;

    this.hideHelpContent = false;
    this.tableLabel = '';
    this.formLabel = '';
    this.constantTableLabel = '';
    this.errorMessage = null;
    this.receivedNewScreen = true;

    //inside response either we receive array or single question
    let param = '/troubleshoot/' + action
    let ScreenJSON = this.screenJsonService.getData(param).subscribe((response: any) => {
      // this.taxbuddyDataService.getData(action).subscribe((response) => {
      console.log("response", response)
      this.tableData = null;
      this.dynamicTable = null;
      this.constantTable = null;
      this.currentQuestion = response.data;

      // if (this.currentQuestion.type == 'END' || this.currentQuestion.type == 'SOLUTIONEND') {
      this.description = this.currentQuestion.description
      // }

      if (this.currentQuestion && this.currentQuestion.media !== null && this.currentQuestion.media.length !== 0) {
        for (let i = 0; i < this.currentQuestion.media.length; i++) {
          if (this.currentQuestion.media[i].ctype == 'IMG' || this.currentQuestion.media[i].ctype == 'png' || this.currentQuestion.media[i].ctype == 'jpg' || this.currentQuestion.media[i].ctype == 'svg' || this.currentQuestion.media[i].ctype == 'gif') {
            this.onlyImage.push(this.currentQuestion.media[i])
          }
          if (this.currentQuestion.media[i].ctype == 'VID' || this.currentQuestion.media[i].ctype == 'mp4') {
            this.onlyVideo.push(this.currentQuestion.media[i])
          }
          if (this.currentQuestion.media[i].ctype == 'DOC' ||
            this.currentQuestion.media[i].ctype == 'pdf' ||
            this.currentQuestion.media[i].ctype == 'txt' ||
            this.currentQuestion.media[i].ctype == 'docx' ||
            this.currentQuestion.media[i].ctype == 'ppt' ||
            this.currentQuestion.media[i].ctype == 'pptx' ||
            this.currentQuestion.media[i].ctype == 'xls' ||
            this.currentQuestion.media[i].ctype == 'xlsx') {

            let docType = this.currentQuestion.media[i];
            if (docType.curl.indexOf(".pdf") > 0)
              docType['cDocType'] = 'pdf';
            else if (docType.curl.indexOf(".ppt") > 0 || docType.curl.indexOf(".pptx") > 0)
              docType['cDocType'] = 'ppt';
            else if (docType.curl.indexOf(".doc") > 0 || docType.curl.indexOf(".docx") > 0 || docType.curl.indexOf(".txt") > 0)
              docType['cDocType'] = 'word';
            else if (docType.curl.indexOf(".xls") > 0 || docType.curl.indexOf(".xlsx") > 0)
              docType['cDocType'] = 'excel';
            else
              docType['cDocType'] = 'doc';
            this.onlyDocument.push(docType)
          }

        }

        console.log("this.onlyDocument", this.onlyDocument);
        console.log("this.onlyVideo", this.onlyVideo);
      }


      console.log("this.onlyImage", this.onlyImage)
      /*   if (this.currentQuestion && this.currentQuestion.media !== null && this.currentQuestion.media.length !== 0) {
          this.currentMedia = this.currentQuestion.media[0].curl
        } */

      if (this.visitedData != null && this.visitedData.length == 0) {
        if (this.currentQuestion.elements[0].optionType === 'checkbox' ||
          this.currentQuestion.elements[0].optionType === 'htmlText') {
          this.saveData(this.currentQuestion, this.currentQuestion.elements[0].nextAction);
        } else {
          this.saveData(this.currentQuestion, this.categoryId);
        }
      } else {
      }
      console.log("this.mediaArray == ", this.mediaArray)

      let i: number;
      // checking in http responce we have received  array or not
      if (response.data instanceof Array) {
        responseArray = response.data;
        // contentId is used to call the help text section data
        contentId = responseArray[0].contentId;
        if (contentId != undefined && contentId !== '') {
          this.hideHelpContent = false;
          //Get content from server
          this.getContent(contentId);
        } else {
          this.hideHelpContent = true;
        }
      } else {
        // if received single question we push it to an array
        responseArray.push(response.data);
      }
      // when response containes value of optionType 'form' we need to get its 'element' property which is an array
      // and
      // re-initialise  array  responseArray variable with values received inside element array.
      console.log("responseArray = ", responseArray);
      console.log("response.data = ", response.data);
      if (responseArray.length !== 0) {
        if (responseArray[0].optionType === QUESTION_TYPE.form ||
          responseArray[0].optionType === QUESTION_TYPE.multiSelect ||
          responseArray[0].optionType === QUESTION_TYPE.junction ||
          responseArray[0].optionType === QUESTION_TYPE.decision ||
          responseArray[0].optionType === QUESTION_TYPE.showhideform) {
          this.formNextAction = responseArray[0].nextAction;
          this.formPrevAction = responseArray[0].parentId;
          this.formType = responseArray[0].optionType;
          //let assesseType = ''//this.assesseType.toUpperCase().trim();


          /**
           * With showhideform we display we display only one table implementation on the screen with respect to assessee type.
           */
          if (responseArray[0].optionType === QUESTION_TYPE.showhideform) {
            let showHideArray = responseArray[0].elements;
            let data = [];
            responseArray[0].elements = [];
            this.navigateToPage(this.formNextAction, direction);
          }
          if (responseArray[0].optionType === QUESTION_TYPE.multiSelect) {

            for (let count = 0; count < responseArray[0].length; count++) {
              this.form.controls[responseArray[0].element[count]].value == true;
              break;
            }
            this.formLevelValidationMessage = "Please select at lease one";
          } else {
            this.formLevelValidationMessage = '';// "Please fill all required field";
          }
          responseArray = responseArray[0].elements;
          this.formId = response.data.key;
          this.formLabel = response.data.label;
          this.formFormulaList = response.data.formula;
        } else {
          this.formNextAction = "";
          this.formPrevAction = "";
          this.formId = "";
          this.formFormulaList = [];
        }
      }
      //then
      //loop through from each element of array responseArray to create control types.
      //note : ResponseArray must contain elements of type QuestionBase which generates form controll.
      for (i = 0; i < responseArray.length; i++) {
        // checking optionType of each element to create form controls.
        // after getting of perticular type of optionType,
        // initialise corresponding type of model and pass data of array element that modal.
        if (responseArray[i].optionType === QUESTION_TYPE.radio || responseArray[i].optionType === QUESTION_TYPE.binary) {
          // with option type radio, we received two elements  inside options property,
          // options property contains an array which contains data to render with control.
          let j: number;
          let radioOptions = [];
          //loop on options property and create radio buttons model options array
          for (j = 0; j < responseArray[i].options.length; j++) {
            radioOptions.push({
              key: responseArray[i].options[j].key,
              value: responseArray[i].options[j].label,
              action: responseArray[i].options[j].nextAction
            });
          }
          // instanciating new radio button model
          questionsTemp.push(
            new RadioQuestion({
              key: responseArray[i].key,
              label: responseArray[i].label,
              options: radioOptions,
              parentId: responseArray[i].parentId,
              value: this.getStoredValue(responseArray[i].key),
              order: i + 1,
              requiredKey: responseArray[i].requiredKey,
              media: responseArray[i].media ? responseArray[i].media : []
            }),
          );
        }
        else if (responseArray[i].optionType === QUESTION_TYPE.checkbox) {
          let j: number;
          let checkBoxOptions = [];
          //loop on options property and create radio buttons model options array
          for (j = 0; j < responseArray[i].options.length; j++) {
            checkBoxOptions.push({
              key: responseArray[i].options[j].key,
              value: responseArray[i].options[j].label,
              action: responseArray[i].options[j].nextAction
            });
          }
          questionsTemp.push(
            new CheckBoxQuestion({
              key: responseArray[i].key,
              label: responseArray[i].label,
              parentId: responseArray[i].parentId,
              options: checkBoxOptions,
              value: (this.getStoredValue(responseArray[i].key) == "true" ? true : false),
              order: i + 1,
              requiredKey: responseArray[i].requiredKey
            }),
          );
          this.formNextAction = responseArray[i].nextAction
        } else if (responseArray[i].optionType === QUESTION_TYPE.imageButton) {
          let j: number;
          let imageOptions = [];
          //loop on options property and create radio buttons model options array
          for (j = 0; j < responseArray[i].options.length; j++) {
            imageOptions.push({
              key: responseArray[i].options[j].key,
              value: responseArray[i].options[j].label,
              action: responseArray[i].options[j].nextAction,
              media: responseArray[i].options[j].media
            });
          }
          questionsTemp.push(
            new ImageButton({
              key: responseArray[i].key,
              label: responseArray[i].label,
              parentId: responseArray[i].parentId,
              options: imageOptions,
              value: (this.getStoredValue(responseArray[i].key) == "true" ? true : false),
              order: i + 1,
              requiredKey: responseArray[i].requiredKey
            }),
          );
        }
        else if (responseArray[i].optionType === QUESTION_TYPE.text) {
          questionsTemp.push(
            new TextboxQuestion({
              key: responseArray[i].key,
              label: responseArray[i].label,
              value: this.getStoredValue(responseArray[i].key),
              formula: responseArray[i].formula,
              requiredKey: responseArray[i].requiredKey,
              minLength: responseArray[i].minLength,
              maxLength: responseArray[i].maxLength,
              parentId: responseArray[i].parentId,
              order: i + 1,
              controlType: 'text'
            }),
          );
        }
        else if (responseArray[i].optionType === QUESTION_TYPE.arithmetic) {
          questionsTemp.push(
            new ArithmeticQuestion({
              key: responseArray[i].key,
              label: responseArray[i].label,
              value: this.getStoredValue(responseArray[i].key),
              formula: responseArray[i].formula,
              requiredKey: responseArray[i].requiredKey,
              parentId: responseArray[i].parentId,
              order: i + 1
            })
          );
        } else
          if (responseArray[i].optionType === QUESTION_TYPE.textarea) {
            let dataToFeed = this.getStoredValue(responseArray[i].key);
            questionsTemp.push(
              new TextAreaQuestion({
                key: responseArray[i].key,
                label: responseArray[i].label,
                value: this.getStoredValue(responseArray[i].key),
                parentId: responseArray[i].parentId,
                requiredKey: true,
                order: i + 1
              }),
            );
          }
          //instanciating new DateQuestion model while receiving optionType date
          else if (responseArray[i].optionType === QUESTION_TYPE.date) {
            let dateInstance = new DateQuestion({
              key: responseArray[i].key,
              label: responseArray[i].label,
              requiredKey: responseArray[i].requiredKey,
              order: i + 1
            });

            if (this.getStoredValue(responseArray[i].key) !== '') {
              dateInstance.value = new Date(this.getStoredValue(responseArray[i].key)).toISOString()
            }
            console.log(dateInstance)
            questionsTemp.push(dateInstance);
          }
          //instanciating new label model while receiving optionType label
          else if (responseArray[i].optionType === QUESTION_TYPE.label) {
            questionsTemp.push(
              new LableQuestion({
                key: responseArray[i].key,
                label: responseArray[i].label,
                value: responseArray[i].value,
                action: responseArray[i].nextAction,
                requiredKey: responseArray[i].requiredKey,
                order: i + 1
              }),
            );
          } //instanciating new mail model while receiving optionType mail
          else
            if (responseArray[i].optionType === QUESTION_TYPE.mail) {
              questionsTemp.push(
                new EmailboxQuestion({
                  key: responseArray[i].key,
                  label: responseArray[i].label,
                  value: responseArray[i].value,
                  requiredKey: responseArray[i].requiredKey,
                  order: i + 1
                }),
              );
            }
            else if (responseArray[i].optionType === QUESTION_TYPE.button) {
              if (this.formId != "JInvestment") {
                this.payLoad.forEach(allObj => {
                  allObj.allDataObj.forEach(page => {
                    if ((page.key === responseArray[i].key) && (page.value === true || page.value === "true")) {
                      questionsTemp.push(
                        new ActionButton({
                          key: responseArray[i].key,
                          label: responseArray[i].label,
                          value: responseArray[i].value,
                          action: responseArray[i].options[0].action,
                        }),
                      );
                    }
                  })
                });
              }
              else {
                questionsTemp.push(
                  new ActionButton({
                    key: responseArray[i].key,
                    label: responseArray[i].label,
                    value: responseArray[i].value,
                    action: responseArray[i].options[0].action,
                  }),
                );
              }
            }//instanciating new [dropdown] option model while receiving optionType option ,similar to radio button
            else if (responseArray[i].optionType === QUESTION_TYPE.option) {
              let j: number;
              let dropdownOptions = [];
              for (j = 0; j < responseArray[i].options.length; j++) {
                dropdownOptions.push({
                  key: responseArray[i].options[j].label,
                  value: responseArray[i].options[j].label,
                  action: responseArray[i].options[j].nextAction
                })
              }
              questionsTemp.push(
                new DropdownQuestion({
                  key: responseArray[i].value,
                  label: responseArray[i].label,
                  description: responseArray[i].description,
                  options: dropdownOptions,
                  value: this.getStoredValue(responseArray[i].key),
                  parentId: responseArray[i].parentId,
                  media: responseArray[i].media ? responseArray[i].media : [],
                  order: i + 1
                })
              );
              console.log(questionsTemp);
            }
            // instanciating new table model while receiving optionType table,
            // in case of table control we create one more form group
            else if (responseArray[i].optionType === QUESTION_TYPE.table) {
              this.hideHelpContent = true;
              this.tableLabel = responseArray[i].label;
              let j: number;
              let tableColumns = [];

              for (j = 0; j < responseArray[i].options.length; j++) {
                tableColumns.push({
                  key: responseArray[i].options[j].key,
                  value: responseArray[i].options[j].value,
                  action: responseArray[i].options[j].action,
                  controlType: responseArray[i].options[j].optionType,
                  options: responseArray[i].options[j].options,
                  formula: responseArray[i].options[j].formula,
                  requiredKey: responseArray[i].options[j].requiredKey,
                  size: 10
                });
              }
              let tableData = new TableQuestion({
                key: responseArray[i].key,
                label: responseArray[i].label,
                options: tableColumns,
                controlType: responseArray[i].controlType,
                order: i + 1,
                formula: responseArray[i].formula
              });
              questionsTemp.push(tableData);
              let group: any = {};
              this.dynamicTable = new FormGroup(group);

              let storedTableData = this.getStoredTableData(responseArray[i].key);
              this.updateTableRow(tableColumns, storedTableData, tableData);
              let tableWithFooter = this.calculateColumnValues(tableData);
              //created initially first row
              if (tableData.dataEntered.length == 0) {
                this.addRow(tableData)
              }
            }
            else if (responseArray[i].optionType === QUESTION_TYPE.multi) {
              let multiDataOptions = [];
              for (let j = 0; j < responseArray[i].options.length; j++) {
                multiDataOptions.push({
                  key: responseArray[i].options[j].key,
                  value: responseArray[i].options[j].value,
                  action: responseArray[i].options[j].action
                })
              };
              let storedData = this.getMultiDataStoredValue(responseArray[i].key);
              let multiData = new MultiData({
                key: responseArray[i].key,
                label: responseArray[i].label,
                options: multiDataOptions,
                parentId: responseArray[i].parentId,
                value: storedData.length,
                order: i + 1
              });
              questionsTemp.push(multiData);

              if (storedData.length > 0) {
                multiData.assetsSold = storedData;
              }
            } else if (responseArray[i].optionType === QUESTION_TYPE.htmlText) {
              this.formNextAction = responseArray[i].nextAction
            }
      }
      this.questions = questionsTemp;
      this.form = this.qcs.toFormGroup(this.questions);
      if (this.formType == QUESTION_TYPE.multiSelect) {
        if (this.multipleChoiceVatidator.validate(this.questions, this.form)) {
          this.validForm = true;
        }
      }
      this.utilsService.dialogRef.close()
    },
      (error) => {
        this.errorMessage = 'error';
        this.receivedNewScreen = false;
        if (error.status === 500) {
          this.errorMessage = "Opps.....,Something we't wrong";
        }
        this.utilsService.dialogRef.close()
      },
      () => {
        this.receivedNewScreen = false;
      })
  };
  saveData(question, action) {
    let dataFound = false;
    console.log("this.visitedData in saveData method= ", this.visitedData)
    this.visitedData.forEach(element => {
      if (element.question.questionId == question.questionId) {
        element.question = question;
        element.action = action;
        dataFound = true;
      }
    });
    if (!dataFound) {
      this.visitedData.push({
        "question": question,
        "action": action
      });
      this.visitedData = this.visitedData.filter(item => item.question.treeId == this.treeId)
      sessionStorage.setItem('SIDE_DATA', JSON.stringify(this.visitedData))
    }
  }

  /**
   * @param question
   * @method addRow
   * @description Adds table row to table / tableDisplay control
   */
  addRow(question) {
    let i: number;
    let row = [];
    if (this.dynamicTable.status === 'VALID') {

      for (i = 0; i < question.dataEnteredElementsCount; i++) {
        if (question.options[i].controlType === QUESTION_TYPE.text) {
          let tb = new TextboxQuestion({
            key: question.options[i].key + '-' + question.dataEntered.length + '' + i,
            label: '',
            value: '',
            formula: question.options[i].formula || null,
            requiredKey: question.options[i].requiredKey || '',
            order: i + 1,
            parentId: question.options[i].parentId
          });
          row.push(tb);
        } if (question.options[i].controlType === QUESTION_TYPE.textarea) {
          let ta = new TextAreaQuestion({
            key: question.options[i].key + '-' + question.dataEntered.length + '' + i,
            label: '',
            value: '',
            order: i + 1
          });
          row.push(ta);
        }
        else if (question.options[i].controlType === QUESTION_TYPE.date) {
          let d = new DateQuestion({
            key: question.options[i].key + '-' + question.dataEntered.length + '' + i,
            label: '',
            value: '',
            order: i + 1
          });
          row.push(d);
        } else if (question.options[i].controlType === QUESTION_TYPE.option) {
          let j: number;
          let dropdownOptions = [];
          for (j = 0; j < question.options[i].options.length; j++) {
            dropdownOptions.push({
              'key': question.options[i].options[j].key,
              'value': question.options[i].options[j].value,
            })
          }
          let dd = new DropdownQuestion({
            key: question.options[i].key + '-' + question.dataEntered.length + '' + i,
            label: '',
            value: '',
            options: dropdownOptions,
            order: i + 1
          });
          row.push(dd);
        } else if (question.options[i].controlType === QUESTION_TYPE.arithmetic) {
          let ar = new ArithmeticQuestion({
            key: question.options[i].key + '-' + question.dataEntered.length + '' + i,
            label: '',
            value: '',
            order: i + 1
          });
          row.push(ar);
        }
      }
      for (i = 0; i < question.dataEntered.length; i++) {
        let j: number;
        for (j = 0; j < question.dataEntered[i].length; j++) {
          question.dataEntered[i][j].value = this.dynamicTable.value[question.dataEntered[i][j].key];
        }
      }
      question.dataEntered.push(row);
      let group: any = {};
      question.dataEntered.forEach((option) => {
        option.forEach(element => {
          group[element.key] = new FormControl(element.value);
        });
      });
      this.dynamicTable = new FormGroup(group);
    }
  };

  updateTableRow(tableColumns, tableDataArray, tableData) {
    let i: number;
    let ol: number;
    let counter = 0;
    for (ol = 0; ol < tableDataArray.length / tableData.dataEnteredElementsCount; ol++) {

      let row = [];
      let dataFound = 1;
      let stop = 100;
      while (dataFound < tableData.dataEnteredElementsCount) {
        stop = stop - 1;
        if (stop < 0) {
          break;
        }
        let rowFound = false;
        for (i = 0; i < tableData.dataEnteredElementsCount; i++) {
          if (tableData.options[i].controlType === QUESTION_TYPE.text) {
            if (this.getStoredTableValue(tableData.options[i].key + '-' + counter + '' + i, tableDataArray) !== '') {
              rowFound = true;
            }
          } else if (tableData.options[i].controlType === QUESTION_TYPE.textarea) {
            if (this.getStoredTableValue(tableData.options[i].key + '-' + counter + '' + i, tableDataArray) !== '') {
              rowFound = true;
            }
          }
          else if (tableData.options[i].controlType === QUESTION_TYPE.date) {
            if (this.getStoredTableValue(tableData.options[i].key + '-' + counter + '' + i, tableDataArray) !== '') {
              rowFound = true;
            }
          } else if (tableData.options[i].controlType === QUESTION_TYPE.option) {
            if (this.getStoredTableValue(tableData.options[i].key + '-' + counter + '' + i, tableDataArray) !== '') {
              rowFound = true;
            }
          }
          else if (tableData.options[i].controlType === QUESTION_TYPE.arithmetic) {
            rowFound = true;
          }
        }
        for (i = 0; i < tableData.dataEnteredElementsCount; i++) {
          if (tableData.options[i].controlType === QUESTION_TYPE.text) {
            if (this.getStoredTableValue(tableData.options[i].key + '-' + counter + '' + i, tableDataArray) !== '' || rowFound) {
              let tb = new TextboxQuestion({
                key: tableData.options[i].key + '-' + tableData.dataEntered.length + '' + i,
                label: '',
                value: this.getStoredTableValue(tableData.options[i].key + '-' + counter + '' + i, tableDataArray),
                formula: tableData.options[i].formula || null,
                order: i + 1
              });
              row.push(tb);
              dataFound = dataFound + 1;
              rowFound = true;
            }
          }
          else if (tableData.options[i].controlType === QUESTION_TYPE.textarea) {
            if (this.getStoredTableValue(tableData.options[i].key + '-' + counter + '' + i, tableDataArray) !== '' || rowFound) {
              let tb = new TextAreaQuestion({
                key: tableData.options[i].key + '-' + tableData.dataEntered.length + '' + i,
                label: '',
                value: this.getStoredTableValue(tableData.options[i].key + '-' + counter + '' + i, tableDataArray),
                order: i + 1
              });
              row.push(tb);
              dataFound = dataFound + 1;
              rowFound = true;
            }
          }
          else if (tableData.options[i].controlType === QUESTION_TYPE.date) {
            if (this.getStoredTableValue(tableData.options[i].key + '-' + counter + '' + i, tableDataArray) !== '' || rowFound) {
              let tb = new DateQuestion({
                key: tableData.options[i].key + '-' + tableData.dataEntered.length + '' + i,
                label: '',
                value: this.getStoredTableValue(tableData.options[i].key + '-' + counter + '' + i, tableDataArray),
                order: i + 1
              });
              row.push(tb);
              dataFound = dataFound + 1;
              rowFound = true;
            }
          }
          else if (tableData.options[i].controlType === QUESTION_TYPE.option) {
            if (this.getStoredTableValue(tableData.options[i].key + '-' + counter + '' + i, tableDataArray) !== '' || rowFound) {
              let j: number;
              let dropdownOptions = [];
              for (j = 0; j < tableData.options[i].options.length; j++) {
                dropdownOptions.push({
                  key: tableData.options[i].options[j].key,
                  value: tableData.options[i].options[j].value,
                })
              }
              let tb = new DropdownQuestion({
                key: tableData.options[i].key + '-' + tableData.dataEntered.length + '' + i,
                label: '',
                value: this.getStoredTableValue(tableData.options[i].key + '-' + counter + '' + i, tableDataArray),
                options: dropdownOptions,
                order: i + 1
              });
              row.push(tb);
              dataFound = dataFound + 1;
              rowFound = true;
            }
          }
          else if (tableData.options[i].controlType === QUESTION_TYPE.arithmetic) {
            if (this.getStoredTableValue(tableData.options[i].key + '-' + counter + '' + i, tableDataArray) !== '' || rowFound) {
              let tb = new ArithmeticQuestion({
                key: tableData.options[i].key + '-' + tableData.dataEntered.length + '' + i,
                label: '',
                value: this.getStoredTableValue(tableData.options[i].key + '-' + counter + '' + i, tableDataArray),
                order: i + 1
              });
              row.push(tb);
              dataFound = dataFound + 1;
              rowFound = true;
            }
          }
        }
        if (rowFound) {
          tableData.dataEntered.push(row);
        }
        counter = counter + 1;
      }
    }
    let group: any = {};
    tableData.dataEntered.forEach(option => {
      option.forEach((element) => {
        group[element.key] = element.requiredKey === true ? new FormControl(element.value || '',
          [Validators.required, Validators.maxLength(element.maxLength), Validators.minLength(element.minLength)]) : new FormControl(element.value || '',
            [Validators.maxLength(element.maxLength), Validators.minLength(element.minLength)]);
      });
      this.calculateColumnValues(tableData);
    });
    this.dynamicTable = new FormGroup(group);
  };

  getMultiDataStoredValue(keyToSearch) {
    let dataFound = [];
    this.payLoad.forEach(allObj => {
      allObj.allDataObj.forEach(page => {
        if (page.key == keyToSearch) {
          dataFound = page.multiValue;
        }
      })
    });
    return dataFound;
  };

  removeRow(index, tableData) {
    tableData.dataEntered[index].forEach(element => {
      this.dynamicTable.removeControl(element.key);
    });
    tableData.dataEntered = [];
    if (this.dynamicTable !== undefined) {
      let data: any = {};
      let tableValues = [];
      data.key = tableData.key;
      for (let key in this.dynamicTable.value) {
        let tableValue: any = {};
        tableValue.key = key;
        tableValue.value = this.dynamicTable.value[key];
        tableValues.push(tableValue);
      }
      data.tableValue = tableValues;
      let returnData = this.updateStoredTableValue(tableData.key, tableValues);
      if (returnData == '') {
        let generatedData: any = {};
        generatedData.allDataObj = [];
        generatedData.allDataObj.push(data);
        generatedData.parentId = this.formPrevAction;
        this.pushOrUpdate(generatedData);
      }
      let storedTableData = this.getStoredTableData(tableData.key);
      this.updateTableRow(tableData.options, storedTableData, tableData);
    }
  };

  private htmlEditor() {
    this.router.navigate(["edit", { userId: this.userId, taxQueryId: this.taxQueryId }]);
  };

  /* openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }; */

  showContent(content) {
    this.helpContent = this.sanitizer.bypassSecurityTrustHtml(content);
  };

  getContent(id) {
    console.log("handler")
    this.screenJsonService.contentData(id).subscribe(response => {
      let data = response.data;
      if (data !== undefined && data !== null) {
        this.showContent(data['content']);
      } else {
        this.showContent('');
      }
    }, error => {
      console.log("error", error)
    })
  };

  applyConstTableFormula(question) {
    if (question.formula != null && question.formula.length > 0) {
      question.formula.forEach(formula => {
        let finalFormula = '';

        if (formula != null) {
          for (let k = 0; k < formula.length; k++) {
            if (k == 0) continue;
            if (formula[k].indexOf("A") == 0 || formula[k].indexOf("Q") == 0) {
              finalFormula += (this.constantTable.controls[formula[k]].value == '' ? 0 : isNaN(this.constantTable.controls[formula[k]].value) ? 0 : this.constantTable.controls[formula[k]].value);
            } else if (formula[k].indexOf("+") || formula[k].indexOf("/") || formula[k].indexOf("-") || formula[k].indexOf("(")
              || formula[k].indexOf(")") || formula[k].indexOf("*")) {
              finalFormula += formula[k];
            }
          }
          this.constantTable.controls[formula[0]].setValue(eval(finalFormula));
        } else { console.warn('NO FORMULA RECEIVED'); }
      });
    }
  };

  applyFormula(question) {
    if (question.dataEntered.length > 0) {
      for (let i = 0; i < question.dataEntered.length; i++) {
        let row = question.dataEntered[i];
        for (let j = 0; j < row.length; j++) {
          if (row[j].formula != null) {

            let formulas = row[j].formula;

            formulas.forEach(formula => {
              let finalFormula = '';
              let outputFormula = '';
              let emptyFieldFound = false;
              if (formula[1] === 'serviceCall') {
                let paramString = formula[2];
                for (let k = 3; k < formula.length; k = k + 2) {
                  if (k != 3)
                    paramString += "&";
                  let elementValue = null;
                  if (formula[k + 1].indexOf('~') >= 0) {
                    elementValue = this.getFormulaElementValue(formula[k + 1]);
                  } else {
                    row.forEach(element => {
                      if (element.key.indexOf(formula[k + 1]) >= 0) {
                        if (element instanceof DateQuestion) {
                          if (this.dynamicTable.controls[element.key].value !== '' && this.dynamicTable.controls[element.key].value !== null && this.dynamicTable.controls[element.key].value !== undefined)
                            elementValue = new Date(this.dynamicTable.controls[element.key].value).toISOString();
                        } else {
                          elementValue = (this.dynamicTable.controls[element.key].value == '' ? '0' : this.dynamicTable.controls[element.key].value);
                        }
                      }
                    });
                  }
                  paramString += formula[k] + "=" + elementValue;
                  if (elementValue == '' || elementValue == undefined) {
                    emptyFieldFound = true;
                  }
                }
                if (!emptyFieldFound) {
                  this.screenJsonService.getCalculatedValue(paramString).subscribe(success => {
                    row.forEach(element => {
                      if (element.key.indexOf(formula[0]) >= 0) {

                        this.dynamicTable.controls[element.key].setValue(success.data);
                      }
                    });
                  }, failure => {
                  });
                }
              } else {
                for (let k = 0; k < formula.length; k++) {
                  if (k == 0) {
                  } else {
                    if (formula[k].indexOf("A") == 0 || formula[k].indexOf("Q") == 0) {
                      row.forEach(element => {
                        if (element.key.indexOf(formula[k]) >= 0) {
                          finalFormula += (this.dynamicTable.controls[element.key].value == '' ? '0' : this.dynamicTable.controls[element.key].value);
                        }
                      });
                    } else if (formula[k].indexOf("+") || formula[k].indexOf("/") || formula[k].indexOf("-") || formula[k].indexOf("(")
                      || formula[k].indexOf(")") || formula[k].indexOf("*")) {
                      finalFormula += formula[k];
                    } else {
                      console.log("No action perofrm")
                    }
                  }
                }
                row.forEach(element => {
                  if (element.key.indexOf(formula[0]) >= 0) {
                    this.dynamicTable.controls[element.key].setValue(eval(finalFormula));
                  }
                });
              }
            });
          }
        }
      }
    }
    this.calculateColumnValues(question);
  };

  listData(multiDataOBj) {
    multiDataOBj.assetsSold = [];
    for (let i = 0; i < this.form.controls[multiDataOBj.key].value; i++) {
      multiDataOBj.assetsSold.push([]);
    }
    let data: any = {};
    data.key = multiDataOBj.key
    data.multiValue = multiDataOBj.assetsSold;
    let generatedData: any = {};
    generatedData.allDataObj = [];
    generatedData.allDataObj.push(data)
    generatedData.parentId = multiDataOBj.parentId;
    generatedData.key = this.formId;
    this.pushOrUpdate(generatedData);
  };

  populateStoredValue(constantTableQuestion) {
    if (constantTableQuestion != null) {
      constantTableQuestion.elements.forEach(element => {
        element.elements.forEach(question => {
          if (question instanceof ArithmeticQuestion) {
            if (question.formula != null) {
              question.formula.forEach(formula => {
                if (formula.length > 1) {
                  if (formula[1] == 'sum') {
                    let tableTocalculate = formula[2];
                    let keyArray = [];
                    while (tableTocalculate.indexOf('~') >= 0) {
                      keyArray.push(tableTocalculate.substring(0, tableTocalculate.indexOf('~')));
                      tableTocalculate = tableTocalculate.substring(tableTocalculate.indexOf('~') + 1)
                    }
                    if (tableTocalculate != '') {
                      keyArray.push(tableTocalculate);
                    }

                    let sumToDisplay = 0;
                    this.payLoad.forEach(allObj => {
                      if (allObj.key == keyArray[0]) {
                        if (allObj.allDataObj[0].tableValue != null) {
                          allObj.allDataObj[0].tableValue.forEach(element => {
                            let tempKey = element.key.substring(0, element.key.indexOf('-'))
                            if (tempKey === keyArray[2]) {
                              sumToDisplay += parseFloat(element.value);
                            }
                          });
                        }
                      }
                    });
                    this.constantTable.controls[formula[0]].setValue(sumToDisplay);
                  } else if (formula[1].indexOf('~') >= 0) {
                    let keyToFetch = formula[1];
                    let keyArray = [];
                    while (keyToFetch.indexOf('~') >= 0) {
                      keyArray.push(keyToFetch.substring(0, keyToFetch.indexOf('~')));
                      keyToFetch = keyToFetch.substring(keyToFetch.indexOf('~') + 1)
                    }
                    if (keyToFetch != '') {
                      keyArray.push(keyToFetch);
                    }
                    this.payLoad.forEach(allObj => {
                      if (allObj.key == keyArray[0]) {
                        if (allObj.allDataObj[0].value != null) {
                          this.constantTable.controls[formula[0]].setValue(allObj.allDataObj[0].value);
                        }
                      }
                    });
                  }
                }
              });
            }
          } else if (question instanceof TextboxQuestion) {
            this.applyConstTableFormula(question);
          }
        });
      });
    }
  };

  /**
  * @author Tushar Khairnar
  * @description Table column calculations.....
  */
  calculateColumnValues(question) {
    let tempFooterArray = [];
    question.options.forEach(element => {
      let formulaFound = false;
      let footerElement = {
        label: '',
        column: element.key,
        opearation: 'sum',
        value: 0
      }

      if (question.formula != null) {
        question.formula.forEach(columnFormula => {
          if (columnFormula[1] == element.key) {
            footerElement.label = columnFormula[2];
            formulaFound = true;
          }
        });
        if (formulaFound) {
          if (this.dynamicTable != null) {
            for (let key in this.dynamicTable.value) {
              let tempKey = key.substring(0, key.indexOf('-'));
              if (footerElement.column === tempKey) {
                let tempValue = this.dynamicTable.controls[key].value;
                if (!isNaN(parseFloat(tempValue))) {
                  footerElement.value += parseFloat(tempValue);
                }
              }
            }
          }
        }
      }
      tempFooterArray.push(footerElement);
    });
    question.footer = tempFooterArray;

    return question.footer;
  };


  goToMultiple(multiDataOBj, index) {
    let MULTI_ASSETS_SOLD_STATE = {
      previous: multiDataOBj.key,
      index: index,
      parentId: multiDataOBj.parentId,
      formId: this.formId,
      taxQueryId: this.taxQueryId,
      userId: this.userId
    };

    sessionStorage.setItem('MULTI_ASSETS_SOLD_STATE', JSON.stringify(MULTI_ASSETS_SOLD_STATE));
    /**
    * @constant MULTIPLE_PAYLOAD
    * @description scrutiny data payload hold detailed payload and contains data which is get from the server and post to the server
    */
    sessionStorage.setItem('MULTIPLE_PAYLOAD', JSON.stringify(multiDataOBj.assetsSold[index]));
    sessionStorage.setItem('SCRUTINY_DATA', JSON.stringify(this.scrutiny));
    this.router.navigate(['multi', multiDataOBj.options[0].action]);
  };

  deleteMultiData(index) {
    this.payLoad.forEach(element => {
      element.allDataObj.forEach(allDataObj => {
        let multiValue = allDataObj.multiValue;
        if (multiValue !== null && multiValue !== undefined) {
          allDataObj.multiValue.splice(index, 1);
        }
      });
    });
    sessionStorage.setItem('SCRUTINY_DATA', JSON.stringify(this.scrutiny));
  };
  /**
   * @method executeAllFormulae
   * @param
   * @description  called on every keyup event inside template. This method prosess formula array received inside JSON.
   **/
  executeAllFormulae() {
    if (this.formFormulaList != null && this.formFormulaList.length > 0) {
      this.formFormulaList.forEach(formula => {
        let finalFormula = '';
        let emptyFieldFound = false;
        if (formula[1] === 'serviceCall') {
          let paramString = formula[2];
          for (let k = 3; k < formula.length; k = k + 2) {
            if (k != 3)
              paramString += "&";
            paramString += formula[k] + "=" + this.getFormulaElementValue(formula[k + 1]);
            if (this.getFormulaElementValue(formula[k + 1]) == '' || this.getFormulaElementValue(formula[k + 1]) == undefined) {
              emptyFieldFound = true;
            }
          }
          if (!emptyFieldFound) {
            this.screenJsonService.getCalculatedValue(paramString).subscribe(success => {
              this.setFormulaValue(formula[0], success.data);
            }, failure => {
              console.log("Fauilure in formula service call");
            }, null);
          } else {
            console.log("----- NO service call made ------");
          }
        } else if (formula[1] === 'max') {
          for (let k = 0; k < formula.length; k++) {
            if (k == 0) continue;
            if (k == 1) continue;
            if (formula[k].indexOf("+") >= 0 || formula[k].indexOf("(") >= 0 || formula[k].indexOf(")") >= 0 || formula[k].indexOf("of") >= 0) {

              if (formula[k] === "of") {
                finalFormula += ",";
              } else {
                finalFormula += formula[k];
              }
            } else {
              let elementValue = this.getFormulaElementValue(formula[k]);
              finalFormula += (elementValue == '' ? 0 : isNaN(Number(elementValue)) ? 0 : elementValue);
            }
          }
          this.setFormulaValue(formula[0], 'Math.max(' + finalFormula + ')');
        } else {
          for (let k = 0; k < formula.length; k++) {
            if (k == 0) continue;
            if (formula[k].indexOf("+") >= 0 || formula[k].indexOf("/") >= 0 || formula[k].indexOf("-") >= 0 || formula[k].indexOf("(") >= 0
              || formula[k].indexOf(")") >= 0 || formula[k].indexOf("*") >= 0) {
              finalFormula += formula[k];
            } else {
              let elementValue = this.getFormulaElementValue(formula[k]);
              finalFormula += (elementValue == '' ? 0 : isNaN(Number(elementValue)) ? 0 : elementValue);
            }
          }
          this.setFormulaValue(formula[0], finalFormula);
        }
      })
    }
  };
  setFormulaValue(elementPath: string, formulaEval) {
    if (elementPath != null) {
      let elements = elementPath.split("~");
      if (elements != null && elements.length > 0) {
        if (this.formId == elements[0]) {
          if (elements.length == 2) {
            this.form.controls[elements[1]].setValue(eval(formulaEval));
          } else if (elements.length == 3) {
            this.constantTable.controls[elements[2]].setValue(eval(formulaEval));
          }
        }
      }
    }
  };

  getFormulaElementValue(elementPath: string) {
    if (elementPath != null) {
      let elements = elementPath.split("~");
      if (elements != null && elements.length > 0) {
        if (elements[0] == "sum") {
          if (this.formId == elements[1]) {
            let sumToDisplay = 0;
            let tableData = null;
            this.questions.forEach(question => {
              if (question instanceof TableQuestion) {
                tableData = question;
              }
            });
            tableData.dataEntered.forEach(data => {
              if (data.length > 0) {
                data.forEach(element => {
                  let tempKey = element.key.substring(0, element.key.indexOf('-'))
                  if (tempKey === elements[3]) {
                    sumToDisplay += parseFloat(this.dynamicTable.controls[element.key].value || 0);
                  }
                });
              }
            });
            return sumToDisplay;
          } else {
            let sumToDisplay = 0;
            this.payLoad.forEach(allObj => {
              if (allObj.key == elements[1]) {
                allObj.allDataObj.forEach(element => {
                  if (element.key == elements[2]) {
                    element.tableValue.forEach(tableElement => {
                      let tempKey = tableElement.key.substring(0, tableElement.key.indexOf('-'))
                      if (tempKey === elements[3]) {
                        sumToDisplay += parseFloat(tableElement.value);
                      }
                    });
                  }
                });
              }
            });
            return sumToDisplay;
          }
        } else {
          if (this.formId == elements[0]) {
            if (elements.length == 2) {
              let valToReturn = '';
              this.questions.forEach(question => {
                if (question.key == elements[1]) {
                  if (question instanceof DateQuestion) {
                    if (this.form.controls[elements[1]].value !== '' && this.form.controls[elements[1]].value !== null && this.form.controls[elements[1]].value !== undefined)
                      valToReturn = new Date(this.form.controls[elements[1]].value).toISOString();
                  } else {
                    valToReturn = this.form.controls[elements[1]].value;
                  }
                }
              });
              return valToReturn;
            } else if (elements.length == 3) {
              let valToReturn = '';
              this.constantTableData.elements.forEach(constTableElement => {
                constTableElement.elements.forEach(row => {
                  if (row.key == elements[2]) {
                    if (row instanceof DateQuestion) {
                      if (this.form.controls[elements[1]].value !== '' || this.form.controls[elements[1]].value !== null || this.form.controls[elements[1]].value !== undefined)
                        valToReturn = new Date(this.constantTable.controls[elements[2]].value).toISOString();
                    } else {
                      valToReturn = this.constantTable.controls[elements[2]].value;
                    }
                  }
                });
              });
              return valToReturn;
            }
          } else {
            let valToReturn = '';
            if (elements.length == 2) {
              this.payLoad.forEach(allObj => {
                if (allObj.key == elements[0]) {
                  allObj.allDataObj.forEach(element => {
                    if (element.key == elements[1]) {
                      valToReturn = element.value;
                    }
                  });
                }
              });
            } else if (elements.length == 3) {
              this.payLoad.forEach(allObj => {
                if (allObj.key == elements[0]) {
                  allObj.allDataObj.forEach(element => {
                    if (element.key == elements[1]) {
                      element.constTableValue.forEach(constTableElement => {
                        if (constTableElement.key == elements[2]) {
                          valToReturn = constTableElement.value;
                        }
                      });
                    }
                  });
                }
              });
            }
            return valToReturn;
          }
        }
      }
    }
    return "";
  };
  /**
   * @author Tushar Khairnar
   * @description Validation for junction screen or screen which only has button validation
   *  */
  validateButtonScreen() {
    let validState: boolean
    for (let i = 0; i < this.questions.length; i++) {
      let buttonKey = this.questions[i]['action'];
      this.payLoad.forEach(item => {

        if (item.parentId == "JSourceIncome" || item.parentId == "JAssets" || item.parentId == "JReasons" || item.parentId == "JShares" || item.parentId == "JJwellery") {
          if (buttonKey == item.key) {
            validState = true;
          }
          else {

            validState = false;
          }
        }
      })
    }
    return validState;
  }
  setNextAction(nextAction) {
    console.log("nextAction = ", nextAction)
    this.formNextAction = nextAction;
  }
  navigateToQuestion(questionId) {
    // first remove all trailing questions
    let vistedQuestions = [];
    for (let i = 0; i < this.visitedData.length; i++) {
      if ((this.visitedData[i]).question.questionId == questionId) {
        break;
      } else {
        vistedQuestions.push(this.visitedData[i]);
      }
    }
    this.visitedData = vistedQuestions;
    this.router.navigate(['troubleshoot', questionId]);
    /*  this.router.navigate(['troubleshoot', questionId]);
     window.location.reload(); */
    this.navigateToPage(questionId);
    console.log("this.vistedData navigate", this.visitedData)
  }

  back() {
    /* let breadCrumbArray = []
    breadCrumbArray = JSON.parse(sessionStorage.getItem('BREAD_CRUMB'))
    breadCrumbArray = [] */
    sessionStorage.setItem('BREAD_CRUMB', JSON.stringify([]))
    sessionStorage.setItem('SIDE_DATA', JSON.stringify([]))
    this.router.navigate(['category', 0])
  }

  goToUrl(url) {
    window.open(url)
  }
}

interface ScrutinyReasonsStatus {
  reasonId: string,
  implementStatus: string
  startAction: string,
  knownFlag: string,
  reasonText: string
  endId: string
}
