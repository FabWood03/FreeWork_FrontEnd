import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ErrorUtils} from '../../../util/ErrorUtils';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CountdownComponent implements OnInit, OnDestroy {
  @Input() startDate!: Date;
  @Input() endDate!: Date;

  totalSeconds: number = 0;
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  private timer: any;

  constructor(
    private errorUtils: ErrorUtils
  ) {}

  ngOnInit(): void {
    this.initializeCountdown();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  private initializeCountdown(): void {
    const now = new Date();

    if (this.startDate.getTime() > now.getTime()) {
      return;
    }

    this.totalSeconds = Math.floor((this.endDate.getTime() - now.getTime()) / 1000);

    if (this.totalSeconds > 0) {
      this.updateTime();
      this.startCountdown();
    }
  }

  private updateTime(): void {
    this.days = Math.floor(this.totalSeconds / 86400); // 1 giorno = 86400 secondi
    this.hours = Math.floor((this.totalSeconds % 86400) / 3600); // 1 ora = 3600 secondi
    this.minutes = Math.floor((this.totalSeconds % 3600) / 60); // 1 minuto = 60 secondi
    this.seconds = this.totalSeconds % 60; // Restante in secondi
  }

  private startCountdown(): void {
    this.clearTimer();
    this.timer = setInterval(() => {
      if (this.totalSeconds > 0) {
        this.totalSeconds--;
        this.updateTime();
      } else {
        this.clearTimer(); // Ferma il timer una volta finito
      }
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  formatTime(time: number): string {
    return time < 10 ? `0${time}` : `${time}`;
  }
}
