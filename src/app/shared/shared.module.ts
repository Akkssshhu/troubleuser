import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { ButtonGroupComponent } from './button-group/button-group.component';
import { MaterialModule } from './material.module';
import { LoaderDialogComponent } from './loader/loader.dialog.component';
import { SearchComponent } from './search/search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [ButtonGroupComponent,LoaderDialogComponent,SearchComponent],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    CarouselModule
  ],
  exports:[ButtonGroupComponent,LoaderDialogComponent,SearchComponent,CarouselModule],
  entryComponents:[LoaderDialogComponent,SearchComponent]
})
export class SharedModule { }
