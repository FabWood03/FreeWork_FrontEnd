import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {OrderResponseDTO} from '../../dto/response/OrderResponseDTO';
import {environment} from '../../../environment';

@Component({
  selector: 'app-single-order',
  templateUrl: './single-order.component.html',
  styleUrls: ['./single-order.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SingleOrderComponent {
  @Input() singleOrder!: OrderResponseDTO;
  @Input() visible: boolean = false;
  @Output() dialogToggle = new EventEmitter<{ visible: boolean, productId: number }>();
  selectedProductId?: number;
  apiBaseUrl = environment.apiBaseUrl;

  constructor() {

  }

  toggleDialog(orderProductId: number) {
    this.visible = !this.visible;
    this.selectedProductId = orderProductId;
    this.dialogToggle.emit({visible: this.visible, productId: this.selectedProductId!});
  }
}
