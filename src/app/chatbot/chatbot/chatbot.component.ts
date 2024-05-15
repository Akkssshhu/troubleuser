import { Component, OnInit, ViewChildren, QueryList, ElementRef, OnDestroy, Inject } from '@angular/core';
import { QuestionBase } from '../../Input-Type/question-base';
import { FormGroup, FormControl } from '@angular/forms';
import { TableQuestion } from '../../Input-Type/question-table';
import { ConstantTableQuestion } from '../../Input-Type/question-constanttable';
import { QuestionControlService } from '../../Input-Type/question-control.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ScreenJsonService } from '../../services/screen-json.service';
import { MultipleChoiceVatidator } from '../../Input-Type/validate-multiple';
import { QUESTION_TYPE } from '../../Input-Type/question-type';
import { RadioQuestion } from '../../Input-Type/question-radio';
import { environment } from 'src/environments/environment';
import { UtilsService } from '../../services/utils.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { SpeechRecognitionService } from '../../services/speech-recognition.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioRecordingServiceService } from '../../services/audio-recording-service.service';
import { HttpHeaders, HttpRequest, HttpEvent, HttpEventType, HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as $ from "jquery";

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  providers: [QuestionControlService, ScreenJsonService, MultipleChoiceVatidator, UtilsService],
})
export class ChatbotComponent implements OnInit {
  @ViewChildren("focusedDiv") focusedDiv: QueryList<ElementRef>;
  message: FormControl
  customOptions: OwlOptions = {
    items: 1,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    autoWidth: false,
    nav: false
  }
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
  multipartInput: any;
  formId: string | null;
  formLabel: string;
  tableLabel: string;
  constantTableLabel: string;
  formFormulaList = [];
  receivedNewScreen: boolean;
  helpContent
  hideHelpContent = false;
  validForm
  formLevelValidationMessage = ''; categoryId: any;
  taxQueryId: string = '';
  userId: string = "100";
  validDynamicTable;
  validConstantTable;
  formType: string;
  scrutinyType: string;
  scrutiny: any;
  currentQuestion: any;
  visitedData: any = [];
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
  responseFromChild: any;
  categoryIdArray: any;
  chatBotJsonArray = [];
  isListen: boolean = true;
  isRecording = false;
  recordedTime;
  // blobUrl;
  title: string;
  recordedData: any;
  language: any;
  enableInput: boolean;
  startButtonLabel: any;
  // ShowChatBot=false;
  ShowChatBot = true;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ChatbotComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private qcs: QuestionControlService,
    private router: Router,
    private route: ActivatedRoute,
    public screenJsonService: ScreenJsonService,
    private multipleChoiceVatidator: MultipleChoiceVatidator,
    public SpeechRecognitionService: SpeechRecognitionService,
    public utilsService: UtilsService,
    private audioRecordingService: AudioRecordingServiceService,
    private sanitizer: DomSanitizer,
    public HttpClient: HttpClient,) {
    if (this.chatBotJsonArray.length == 0) {
      let anyData = this.utilsService.chatJson()
      console.log("anyData", anyData)
      // this.language = JSON.parse(sessionStorage.getItem('lang'))
      this.language = sessionStorage.getItem('lang')
      console.log("this.language=", this.language)
      anyData.robot.label = this.utilsService.startChatWithLang(this.language);
      this.chatBotJsonArray.push(anyData)
      console.log("this.chatBotJsonArray=", this.chatBotJsonArray)
    }
    this.route.params.subscribe(routeParams => {
      this.categoryId = routeParams.id
      console.log("this.categoryId = ", this.categoryId)
    })

    this.scrutiny = '';// JSON.parse(sessionStorage.getItem('SCRUTINY_DATA'));
    this.multipartInput = null;
    sessionStorage.setItem('saveUpdateParam', '');
    sessionStorage.setItem('SCRUTINY_CURRENT_POSITION', "0")


    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.recordingFailed().subscribe((time) => {
      alert("Failed to Record.");
      console.log("failed recording")
    });

  };

  ngOnInit() {
    let divId = document.getElementById('first_div')
    divId.scroll({ behavior: 'smooth' })
    divId.scrollIntoView();
    this.message = new FormControl('')
    this.form = this.qcs.toFormGroup(this.questions);
    if (this.isListen) { this.listen() }

  }

  chatbot() {

    if (this.ShowChatBot) {

      this.ShowChatBot = false
    } else {
      this.ShowChatBot = true;
    }
    console.log("this.ShowChatBot", this.ShowChatBot)
    this.close()
  }

  /*   public blobToFile = (theBlob: Blob, fileName: string): File => {
      var b: any = theBlob;
      b.lastModifiedDate = new Date();
      b.name = fileName;
      return <File>theBlob;
    } */

  /*   startRecording() {
      if (!this.isRecording) {
        this.message.setValue('We are recording your voice ....')
        this.isRecording = true;
        this.audioRecordingService.startRecording();
        setTimeout(() => {
          this.stopRecording()
        }, 5000)
      } else {
        console.log("unable to record")
      }
    } */

  /*   abortRecording() {
      if (this.isRecording) {
        this.isRecording = false;
        this.audioRecordingService.abortRecording();
      }
    } */

  /*   stopRecording() {
      if (this.isRecording) {
        this.message.setValue('We are recognizing your voice ....')
        this.audioRecordingService.stopRecording();
        this.isRecording = false;

        this.audioRecordingService.getRecordedBlob().subscribe((data) => {
          // this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
          this.recordedData = this.blobToFile(data.blob, data.title);
          this.sendAudio();
          console.log("recored file ", this.recordedData)
        });
      }
    } */

  sendAudio() {

    let formData: any;
    formData = new FormData();
    formData.append('file', this.recordedData);
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem("USER_OBJ")).id_token
      }),
      reportProgress: true
    };
    let param = '/speechToText'
    const url = environment.API + param;
    const req = new HttpRequest('POST', url, formData, httpOptions);

    if (this.utilsService.isNonEmpty(formData)) {
      this.HttpClient.request(req).subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            break;
          case HttpEventType.ResponseHeader:
            break;
          case HttpEventType.UploadProgress:
            break;
          case HttpEventType.Response:
            console.info("response .", event.body)
            if (!this.utilsService.isNonEmpty(event.body)) {
              alert("We could not hear you, Please speak again ..")
              this.message.setValue('')
            } else if (this.utilsService.isNonEmpty(event.body.results) && this.utilsService.isNonEmpty(event.body.results[0].alternatives[0].transcript)) {
              this.message.setValue(event.body.results[0].alternatives[0].transcript);
              this.sendRequest(this.message.value)
            } else {
              this.message.setValue('')
              alert("We unable to recognize your voice, please try again..")
            }
            break;
        }

      }, error => {
        console.error("Failed to add Item.")
      })
    } else {
      console.error("Please select file")
    }

  }

  speak() {
    if ('webkitSpeechRecognition' in window) {
      this.SpeechRecognitionService.record()
        .subscribe(
          (value) => {
            this.message.setValue(value);
            console.log("", value);
          },
          (err) => {
            console.log(err);
            if (err.error == "no-speech") {
              console.log("--restatring service--");
              this.speak();
            }
          },
          () => {
            console.log("--complete--");
            this.speak();
          });
    } else {
      alert("Your browser does not support this feature")
    }
  }

  /*   setListenVar() {
      if (this.isListen) {
        this.isListen = false;
      } else {
        this.isListen = true;
        this.listen();
      }
    } */

  listen() {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      console.error("already speaking");
      return;
    }

    if (this.utilsService.isNonEmpty(this.chatBotJsonArray) && this.chatBotJsonArray.length !== 0) {
      const speakText = new SpeechSynthesisUtterance(this.chatBotJsonArray[this.chatBotJsonArray.length - 1].robot.label);
      speakText.lang = 'hi-Hindi'
      speakText.volume = 1
      speakText.onend = e => {
        console.log("Done speaking", e);
      }

      speakText.onerror = e => {
        console.log("Something goes wrong....");
      }
      synth.speak(speakText)
    }
  }

  ngAfterViewInit() {
    this.focusedDiv.changes.subscribe(() => {
      if (this.focusedDiv && this.focusedDiv.last) {
        this.focusedDiv.last.nativeElement.focus();
      }
    });
  }

  ngAfterContentChecked() {
    // this.language = JSON.parse(sessionStorage.getItem('lang'));
    this.language = sessionStorage.getItem('lang');
    this.startButtonLabel = this.utilsService.setStartButtonLabel(this.language)
  }

  getResponse(event) {
    console.log("Chat Event", event)
    this.responseFromChild = event.label
    this.formNextAction = event.action
  }

  sendRequest(message) {
    if (this.utilsService.isNonEmpty(message)) {
      this.message.setValue('')
      /* if (this.chatBotJsonArray.length == 1) {
        let anyData = this.utilsService.chatJson()
        this.chatBotJsonArray[0].human.label = message
         anyData.robot.label = this.utilsService.helpSentence(this.language, message)
        this.chatBotJsonArray.push(anyData);
        if (this.isListen) {
          this.listen();
        }
      } else */
      // {
      let selectedOption
      if (this.utilsService.isNonEmpty(this.currentQuestion) &&
        this.currentQuestion.type !== 'END' && this.currentQuestion.type !== 'SOLUTIONEND') {
        selectedOption = this.currentQuestion.elements[0].options.filter(item => item.label == message && this.utilsService.isNonEmpty(item.nextAction))
        if (selectedOption.length > 0) {
          this.formNextAction = selectedOption[0].nextAction
          this.responseFromChild = selectedOption[0].label
          this.nextPage()
        } else {
          this.currentQuestion = null;
          let anyData = this.utilsService.chatJson()
          anyData.human = {
            label: message,
            nextAction: ''
          }
          anyData.robot.label = this.robotRandomText();
          this.chatBotJsonArray[this.chatBotJsonArray.length - 1].human.label = message
          this.chatBotJsonArray.push(anyData);
          if (this.isListen) {
            this.listen();
          }
        }
      } else {
        this.searchKeyword(message)
      }
      // }
    } else {
      alert("Please enter something, to continue troubleshoot")
    }

    $("html, body").animate({
      scrollTop: $('.pagebottom').offset().top
      //scrollTop: $('#your-id').offset().top
      //scrollTop: $('.your-class').offset().top
    }, 'slow');
    var element = document.querySelector(".pagebottom");
    element.scrollIntoView();

  }

  robotRandomText() {
    let tempArray = []
    tempArray = this.utilsService.robotRandomTextLanguage(this.language)
    let randomString = Math.floor(Math.random() * tempArray.length);
    return tempArray[randomString]
  }

  goToQuestion(robot) {
    this.enableInput = false;
    this.formNextAction = robot.elements[0].nextAction
    this.responseFromChild = robot.label

    this.chatBotJsonArray = this.chatBotJsonArray.filter(item => item.robot.type !== 'PROBLEM')
    let problem = this.chatBotJsonArray.filter(item => item.robot.type == 'PROBLEM')
    if (problem && problem.length == 0) {
      this.navigateToPage(this.formNextAction)
    }
  }

  searchKeyword(message) {
    this.chatBotJsonArray[this.chatBotJsonArray.length - 1].human.label = message
    let anyData = this.utilsService.chatJson()

    let problems: any;
    let param = '/Troubleshootp/' + message + '?language=' + this.language
    this.screenJsonService.getData(param).subscribe((result: any) => {
      if (this.utilsService.isNonEmpty(result) && result.length > 0) {
        problems = result.filter(item => item.type == 'PROBLEM')
        if (this.utilsService.isNonEmpty(problems) && problems.length > 0) {
          this.enableInput = true;
          anyData.robot.label = this.utilsService.problemResultText(this.language, message);
          anyData.human = {
            label: "",
            nextAction: ""
          }
          this.chatBotJsonArray.push(anyData)

          for (let i = 0; i < problems.length; i++) {
            this.chatBotJsonArray.push({
              human: {
                label: '',
                nextAction: ''
              },
              robot: problems[i]
            })
            if (this.isListen) {
              this.listen();
            }
          }
        } else {
          this.enableInput = false;
          anyData.human = {
            label: message,
            nextAction: ''
          }
          anyData.robot.label = this.utilsService.noSearchResult(this.language)
          this.chatBotJsonArray[this.chatBotJsonArray.length - 1].human.label = message
          this.chatBotJsonArray.push(anyData);
          if (this.isListen) {
            this.listen();
          }
        }
      } else {
        this.chatBotJsonArray = this.chatBotJsonArray.filter(item => item.robot.type !== 'PROBLEM')

        anyData.human = {
          label: message,
          nextAction: ''
        }
        anyData.robot.label = this.robotRandomText()
        this.chatBotJsonArray[this.chatBotJsonArray.length - 1].human.label = message
        this.chatBotJsonArray.push(anyData);
        if (this.isListen) {
          this.listen();
        }
      }
    }, error => {
    })
  }

  nextPage() {
    if (this.formNextAction && this.formNextAction !== null && this.formNextAction !== '' && this.formNextAction !== undefined) {
      this.saveAndNavigate('next');
    }
  };

  storingInformation: boolean;
  /**
   * @author Tushar & Manoj
   * @description
   * */
  saveAndNavigate(direction) {
    this.storingInformation = true;
    let action = null;
    this.errorMessage = '';
    let i: number;
    let generatedData: any = {};
    this.validDynamicTable = false;
    this.validConstantTable = false;
    generatedData.allDataObj = [];
    generatedData.parentId = this.formPrevAction;
    for (i = 0; i < this.questions.length; i++) {
      if (this.questions[i].controlType === QUESTION_TYPE.radio) {
        let selectedRadio = (<RadioQuestion>this.questions[i]);
        let selectionRadioValue = this.formNextAction;
        { action = selectionRadioValue; }
        generatedData.parentId = selectedRadio.parentId;

        if (this.formId == "") { generatedData.key = selectedRadio.key; }
        let data: any = {};
        data.key = selectedRadio.key;
        data.value = selectionRadioValue;
        generatedData.allDataObj.push(data);
        generatedData.action = action;
      }
    }
    if (direction == 'next') {
      if (this.formNextAction != '') {
        /* if (this.formType === QUESTION_TYPE.form) {
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
              if (_reasonIndex < SCRUTINY_REASONS_STATUS.length - 1 && _reasonIndex !== SCRUTINY_REASONS_STATUS.length - 1) {
                if (SCRUTINY_REASONS_STATUS[_reasonIndex + 1].startAction !== '' && (SCRUTINY_REASONS_STATUS[_reasonIndex + 1].implementStatus === 'Y' && SCRUTINY_REASONS_STATUS[_reasonIndex + 1].knownFlag == 'Y')) {
                  this.formNextAction = SCRUTINY_REASONS_STATUS[_reasonIndex + 1].startAction;
                  sessionStorage.setItem('SCRUTINY_CURRENT_POSITION', (_reasonIndex + 1).toString());
                } else if (SCRUTINY_REASONS_STATUS[_reasonIndex + 1].implementStatus === 'N' && SCRUTINY_REASONS_STATUS[_reasonIndex + 1].knownFlag == 'Y') {
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
                this.formNextAction = substr_end;
                alert("will route to annexure");
              }
            }
          }
        } */
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
      for (let i = 0; i < this.payLoad.length - 1; i++) {
        if (this.payLoad[i].key == this.formId) {
        }
      }
    }
    if (this.form.status == 'VALID') {
      if (this.currentQuestion.elements[0].optionType === 'checkbox' ||
        this.currentQuestion.elements[0].optionType === 'htmlText') {
        this.saveData(this.currentQuestion, this.currentQuestion.elements[0].nextAction);
      } else {
        this.saveData(this.currentQuestion, this.categoryId);
      }
      this.navigateToPage(action, direction);
    }
    console.log("this.vistedData ", this.visitedData)
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
    let responseArray = [];
    let questionsTemp = [];
    let contentId;
    this.hideHelpContent = false;
    this.tableLabel = '';
    this.formLabel = '';
    this.constantTableLabel = '';
    this.errorMessage = null;
    this.receivedNewScreen = true;
    let param = '/troubleshoot/' + action + '?language=' + this.language
    this.screenJsonService.getData(param).subscribe((response: any) => {
      console.log("response", response)
      this.tableData = null;
      this.dynamicTable = null;
      this.constantTable = null;
      this.currentQuestion = response.data;
      let anyData = this.utilsService.chatJson()

      anyData.robot = this.currentQuestion
      anyData.human = {
        label: this.responseFromChild,
        nextAction: this.formNextAction
      }
      this.chatBotJsonArray.push(anyData)

      if (this.chatBotJsonArray.length > 1) {
        this.chatBotJsonArray[this.chatBotJsonArray.length - 2].human = {
          label: this.responseFromChild,
          nextAction: this.formNextAction
        }
      }

      if (this.currentQuestion.type == 'END' || this.currentQuestion.type == 'SOLUTIONEND') {
        let tempData = this.utilsService.chatJson()
        tempData.robot.label = this.utilsService.endHelpText(this.language);
        tempData.human = {
          label: "",
          nextAction: ""
        }
        this.chatBotJsonArray.push(tempData)
      }

      if (this.isListen) {
        this.listen();
      }

      console.log("this.chatBotJsonArray = ", this.chatBotJsonArray)
      this.description = this.currentQuestion.description
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
      }
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
      if (response.data instanceof Array) {
        responseArray = response.data;
        contentId = responseArray[0].contentId;
      } else {
        responseArray.push(response.data);
      }
      if (responseArray.length !== 0) {
        if (responseArray[0].optionType === QUESTION_TYPE.form ||
          responseArray[0].optionType === QUESTION_TYPE.multiSelect ||
          responseArray[0].optionType === QUESTION_TYPE.junction ||
          responseArray[0].optionType === QUESTION_TYPE.decision ||
          responseArray[0].optionType === QUESTION_TYPE.showhideform) {
          this.formNextAction = responseArray[0].nextAction;
          this.formPrevAction = responseArray[0].parentId;
          this.formType = responseArray[0].optionType;
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
      for (i = 0; i < responseArray.length; i++) {
        if (responseArray[i].optionType === QUESTION_TYPE.radio || responseArray[i].optionType === QUESTION_TYPE.binary) {
          let j: number;
          let radioOptions = [];
          for (j = 0; j < responseArray[i].options.length; j++) {
            radioOptions.push({
              key: responseArray[i].options[j].key,
              value: responseArray[i].options[j].label,
              action: responseArray[i].options[j].nextAction
            });
          }
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
  close() {
    this.dialogRef.close();
  }
  saveData(question, action) {
    let dataFound = false;
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

  navigateToQuestion(questionId) {
    let vistedQuestions = [];
    for (let i = 0; i < this.visitedData.length; i++) {
      if ((this.visitedData[i]).question.questionId == questionId) {
        break;
      } else {
        vistedQuestions.push(this.visitedData[i]);
      }
    }
    this.visitedData = vistedQuestions;
    // this.router.navigate(['troubleshoot', questionId]);
    this.navigateToPage(questionId);
  }

  back() {
    sessionStorage.setItem('BREAD_CRUMB', JSON.stringify([]))
    sessionStorage.setItem('SIDE_DATA', JSON.stringify([]))
    this.router.navigate(['category', 0])
  }

  nextAction(action) {
    console.log("action ", action)
    this.navigateToPage(action)
  }

  ngOnDestroy() {
    this.SpeechRecognitionService.DestroySpeechObject();
    // this.abortRecording();
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
