import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IconAlertCircle,
  IconBriefcase,
  IconCheck,
  IconCheckCircle,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconCircle,
  IconClipboard,
  IconClock,
  IconEdit,
  IconEye,
  IconEyeOff,
  IconFacebook,
  IconFrown,
  IconInfo,
  IconInstagram,
  IconLogIn,
  IconMap,
  IconMapPin,
  IconMoreVertical,
  IconPhone,
  IconPlusCircle,
  IconSave,
  IconSearch,
  IconSettings,
  IconShoppingBag,
  IconSlash,
  IconTag,
  IconTrash2,
  IconUser
} from 'angular-feather';
import { IconWhatsappComponent } from './whatsapp-icon/whatsapp-icon.component';
import { InsertIconComponent } from './insert-icon/insert-icon.component';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ LoadingComponent, InsertIconComponent, IconWhatsappComponent ],
  exports: [
    IconAlertCircle,
    IconBriefcase,
    IconCircle,
    IconClipboard,
    IconClock,
    IconCheck,
    IconCheckCircle,
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronUp,
    IconEye,
    IconEyeOff,
    IconEdit,
    IconFacebook,
    IconFrown,
    IconLogIn,
    IconInfo,
    IconInstagram,
    IconMap,
    IconMapPin,
    IconMoreVertical,
    IconPhone,
    IconPlusCircle,
    IconSave,
    IconSearch,
    IconSettings,
    IconShoppingBag,
    IconSlash,
    IconTag,
    IconTrash2,
    IconUser,
    IconWhatsappComponent,
    InsertIconComponent,
    LoadingComponent,
  ]
})
export class IconsModule { }
