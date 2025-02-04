import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css']
})
export class ReportingComponent {
  @Input() visible!: boolean;
  @Input() reviewId?: number;
  @Input() productId?: number;
  @Input() userId?: number;

  @Output() submitReport = new EventEmitter<{ title: string; description: string; reviewId?: number }>();
  @Output() submitProduct = new EventEmitter<{ title: string; description: string; productId?: number }>();
  @Output() submitUser = new EventEmitter<{ title: string; description: string; userId?: number }>();
  @Output() closeDialog = new EventEmitter<boolean>();

  title: string = '';
  description: string = '';

  onSubmit() {
    const reportData = {
      title: this.title,
      description: this.description,
    };

    if (this.reviewId) {
      this.submitReport.emit({ ...reportData, reviewId: this.reviewId });
    } else if (this.productId) {
      this.submitProduct.emit({ ...reportData, productId: this.productId });
    } else if (this.userId) {
      this.submitUser.emit({ ...reportData, userId: this.userId });
    }

    this.closeDialog.emit(false);
  }

  handleDialogClose() {
    this.closeDialog.emit(false);
  }
}
