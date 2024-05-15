import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SpeechRecognitionService } from 'src/app/services/speech-recognition.service';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { ChatbotRoutingModule } from './chatbot-routing.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [ChatbotComponent],
  imports: [
    CommonModule,
    ChatbotRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MatDialogModule
  ],
  exports: [ChatbotComponent],
  entryComponents: [ChatbotComponent],

  providers: [SpeechRecognitionService]
})
export class ChatbotModule { }
