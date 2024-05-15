import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TroubleshootRoutingModule } from './troubleshoot-routing.module';
import { TroubleshootComponent } from './troubleshoot/troubleshoot.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule, } from '@angular/material/input';
import { MatButtonModule, } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [TroubleshootComponent],
  imports: [
    CommonModule,
    TroubleshootRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatFormFieldModule
  ]
})
export class TroubleshootModule { }
