import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotLinkPageRoutingModule } from './forgot-link-page-routing.module';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    ForgotLinkPageRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class ForgotLinkPageModule { }
