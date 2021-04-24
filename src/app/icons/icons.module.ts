import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IconAlertCircle,
  IconBriefcase,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconChevronUp,
  IconFacebook,
  IconFrown,
  IconLogIn,
  IconPlusCircle,
  IconSave,
  IconSearch,
  IconSettings,
  IconShoppingBag,
  IconSlash,
  IconTag
} from 'angular-feather';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ LoadingComponent ],
  exports: [
    IconAlertCircle,
    IconBriefcase,
    IconChevronDown,
    IconChevronRight,
    IconChevronUp,
    IconFacebook,
    IconFrown,
    IconLogIn,
    IconPlusCircle,
    IconSave,
    IconSearch,
    IconSettings,
    IconShoppingBag,
    IconSlash,
    IconTag,
    LoadingComponent,
    IconCheck
  ]
})
export class IconsModule { }
