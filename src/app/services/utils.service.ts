import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderDialogComponent } from '../shared/loader/loader.dialog.component';

@Injectable()

export class UtilsService {
  warningsArray: any[] = [];
  dialogRef: any
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }
  /**
  * @function isNonEmpty()
  * @param param
  * @description This function is used for checking the expected paramater is empty undefined or null, this function will be used for objects as well as strings
  * @author Ashish Hulwan
  * @returns this will return boolean value
  */
  isNonEmpty(param): boolean {
    if (param !== null && param !== undefined && param !== "")
      return true
    else
      return false
  }

  isNonZero(param): boolean {
    if (Number(param) !== 0 && param !== null && param !== undefined && param !== "")
      return true
    else
      return false
  }

  /**
* @function openLoaderDialog()
* @param    none
* @description This method is used to open dialog for loader
* @author Arati Danane
*/
  openLoaderDialog() {
    let data = {
      title: "Confirm title"
    }
    this.dialogRef = this.dialog.open(LoaderDialogComponent, {
      width: '500px',
      data: data,
      disableClose: true,
      panelClass: 'background-dialog'
    });

    this.dialogRef.afterClosed().subscribe(result => {

    })
  }

  smoothScrollToTop() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  showSnackBar(msg) {
    this.snackBar.open(msg, 'OK', {
      verticalPosition: 'top',
      horizontalPosition: 'center',
      duration: 3000
    });
  }
  //scroll to specific div
  smoothScrollToDiv(divId) {
    console.log("divId ", typeof (divId))
    return document.getElementById(divId).scrollIntoView({ behavior: "smooth" });
  }
  chatJson() {
    return {
      robot: {
        "questionId": "",
        "treeId": null,
        "type": "",
        "optionType": "",
        "contentId": "",
        "labelMultiLang": [],
        "sectionId": "",
        "nextAction": "",
        "parentId": [],
        "helpTextMultiLang": [],
        "helpText": "",
        "descriptionMultiLang": [],
        "keywords": [],
        "category": "",
        "options": [],
        "key": "",
        "media": [],
        "elements": [],
        "label": "",
        "description": "",
        "published": null
      },
      human: {
        label: '',
        nextAction: ''
      }
    }
  }
  startChatWithLang(lang) {
    let text = ''

    switch (lang) {
      case 'en': {
        // text = "Hello, I am Mr. Bot What is your good name?"
        text = "Hello, I am Virtual Assistant please let me know your problem?"
        break;
      }
      case 'fr': {
        text = "Bonjour, je suis M. Bot. Comment vous appelez-vous?"
        break;
      }
      case 'es': {
        text = "Hola, soy el Sr. Bot. ¿Cuál es tu buen nombre?"
        break;
      }
      case 'hi': {
        text = "हैलो, मैं मिस्टर बॉट हूं आपका नाम क्या है?"
        break;
      }
    }

    return text
  }
  setStartButtonLabel(lang) {
    let start = ''
    switch (lang) {
      case 'en': {
        start = `start`
        break;
      }
      case 'fr': {
        start = `début`
        break;
      }
      case 'es': {
        start = `comienzo`
        break;
      }
      case 'hi': {
        start = `शुरू`
        break;
      }
    }
    return start
  }
  helpSentence(lang, message) {
    let help = ''
    switch (lang) {
      case 'en': {
        help = `Hello ${message}, How can I help you?`
        break;
      }
      case 'fr': {
        help = `Bonjour ${message}, comment puis-je vous aider?`
        break;
      }
      case 'es': {
        help = `¿Hola ${message}, como puedo ayudarte?`
        break;
      }
      case 'hi': {
        help = `हैलो ${message}, मैं कैसे आपकी मदद कर सकता हूं?`
        break;
      }
    }
    return help
  }
  robotRandomTextLanguage(lang) {
    let array = []
    switch (lang) {
      case 'en': {
        array = ['Sorry, I dont understand, Please correct your question.', 'Can you please repeat?', 'It seems that you are entering something else, please ask me correct question.']
        break;
      }
      case 'fr': {
        array = [`Désolé, je ne comprends pas, corrigez votre question, s'il vous plaît`, `Pouvez-vous répéter?`, `Il semble que vous entriez quelque chose d'autre, posez-moi s'il vous plaît la bonne question.`]
        break;
      }
      case 'es': {
        array = [`Lo siento, no entiendo, corrige tu pregunta.`, `¿Puedes repetir por favor?`, `
        Parece que está ingresando algo más, por favor hágame la pregunta correcta.`]
        break;
      }
      case 'hi': {
        array = [`क्षमा करें, मुझे समझ नहीं आया, कृपया अपना प्रश्न सही करें।`, `क्या आप कृपया दोहरा सकते हैं?`, `
        ऐसा लगता है कि आप कुछ और दर्ज कर रहे हैं, कृपया मुझसे सही प्रश्न पूछें।`]
        break;
      }
    }
    return array
  }
  noSearchResult(lang) {
    let result = ''
    switch (lang) {
      case 'en': {
        result = "Sorry, No search result found, Please search something else."
        break;
      }
      case 'fr': {
        result =
          "Désolé, aucun résultat de recherche trouvé, veuillez rechercher autre chose."
        break;
      }
      case 'es': {
        result =
          "Lo sentimos, no se encontraron resultados de búsqueda, busca otra cosa"
        break;
      }
      case 'hi': {
        result =
          "क्षमा करें, कोई खोज परिणाम नहीं मिला, कृपया कुछ और खोजें।"
        break;
      }
    }
    return result
  }
  problemResultText(lang, message) {
    let problem = ''
    switch (lang) {
      case 'en': {
        problem = `I think your question is about ${message}, I can help you, Would you like to get started?`
        break;
      }
      case 'fr': {
        problem = `Je pense que votre question concerne ${message}, je peux vous aider, voulez-vous commencer?`
        break;
      }
      case 'es': {
        problem = `Creo que su pregunta es sobre ${message}, puedo ayudarlo, ¿le gustaría comenzar?`
        break;
      }
      case 'hi': {
        problem = `मुझे लगता है कि आपका सवाल है ${message}, मैं आपकी मदद कर सकता हूं, क्या आप शुरू करना चाहेंगे?`
        break;
      }
    }
    return problem
  }
  endHelpText(lang) {
    let endText = ''
    switch (lang) {
      case 'en': {
        endText = `This is ends here, Please enter the problem if you want to continue.`
        break;
      }
      case 'fr': {
        endText = `Ce problème se termine ici, si vous souhaitez continuer, veuillez enregistrer un problème.`
        break;
      }
      case 'es': {
        endText = `Este problema termina aquí, si desea continuar con esto, presente un problema.`
        break;
      }
      case 'hi': {
        endText = `यह समस्या यहाँ समाप्त होती है, यदि आप इसे जारी रखना चाहते हैं, तो  कृपया समस्या दर्ज करें।`
        break;
      }
    }
    return endText
  }
}
