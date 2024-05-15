import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TroubleshootComponent } from './troubleshoot/troubleshoot.component';

const routes: Routes = [
  {
    path:'',
    component:TroubleshootComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TroubleshootRoutingModule { }
