import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticatedGuard } from './services/auth-gaurd-service';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FooterComponent } from './footer/footer.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatStepperModule } from '@angular/material/stepper';
import { ChatbotModule } from './chatbot/chatbot.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    FooterComponent,
    // ChatbotComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    ChatbotModule

  ],
  exports: [ForgotPasswordComponent],
  entryComponents: [ForgotPasswordComponent],
  providers: [AuthenticatedGuard, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent],

})
export class AppModule { }
