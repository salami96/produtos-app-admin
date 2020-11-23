import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconAlertCircle, IconFacebook, IconLogIn, IconSave, IconSlash } from 'angular-feather';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ LoadingComponent ],
  exports: [
    IconAlertCircle,
    IconFacebook,
    IconLogIn,
    IconSave,
    IconSlash,
    LoadingComponent
  ]
})
export class IconsModule { }
