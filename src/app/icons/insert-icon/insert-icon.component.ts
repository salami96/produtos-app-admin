import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-insert-icon',
  templateUrl: './insert-icon.component.html',
  styleUrls: ['./insert-icon.component.css']
})
export class InsertIconComponent implements OnInit {
  @Input() icon: string;
  @Input() mini: boolean;
  safeHtml: SafeHtml;
  constructor(
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformID: Object,
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformID)) {
      if (this.mini) this.icon = this.icon.replace(/36px/g,'18px');
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.icon);
    }
  }

}
