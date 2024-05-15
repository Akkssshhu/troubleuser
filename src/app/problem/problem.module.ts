import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProblemRoutingModule } from './problem-routing.module';
import { ProblemComponent } from './problem/problem.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ProblemComponent],
  imports: [
    CommonModule,
    ProblemRoutingModule,
    SharedModule
  ]
})
export class ProblemModule { }
