import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css'],
  animations: [
    trigger('state', [
      transition(':enter', [
        style({ bottom: '-100px', transform: 'translate(-50%, 0) scale(0.3)' }),
        animate('150ms cubic-bezier(0, 0, 0.2, 1)', style({
          transform: 'translate(-50%, 0) scale(1)',
          opacity: 1,
          bottom: '20px'
        }))
      ]),
      transition(':leave', [
        animate('150ms cubic-bezier(0.4, 0, 1, 1)', style({
          transform: 'translate(-50%, 0) scale(0.3)',
          opacity: 0,
          bottom: '-100px'
        }))
      ])
    ])
  ]
})
export class SnackbarComponent implements OnInit, OnDestroy {
  show: boolean;
  message: string;
  type: string;
  action: string;
  snackbarSubscription: Subscription;

  constructor(private snkService: SnackbarService) { }

  ngOnInit() {
    this.snackbarSubscription = this.snkService.snackbarState
    .subscribe(
      (state) => {
        this.type = state.type || 'success';
        this.action = state.action;
        this.message = state.message;
        this.show = true;

        const timeout = state.action ? 10000 : 5000;
        setTimeout(() => {
          this.show = false;
        }, timeout);
      }
    );
  }

  ngOnDestroy() {
    this.snackbarSubscription.unsubscribe();
  }

}
