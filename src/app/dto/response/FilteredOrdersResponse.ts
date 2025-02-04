import {OrderResponseDTO} from './OrderResponseDTO';

export class FilteredOrdersResponse {
  allOrders: OrderResponseDTO[] = [];
  pendingOrders: OrderResponseDTO[] = [];
  takeOnOrders: OrderResponseDTO[] = [];
  deliveredOrders: OrderResponseDTO[] = [];
  delayedOrders: OrderResponseDTO[] = [];
  refusedOrders: OrderResponseDTO[]

  constructor(
    allOrders: OrderResponseDTO[],
    pendingOrders: OrderResponseDTO[],
    takeOnOrders: OrderResponseDTO[],
    deliveredOrders: OrderResponseDTO[],
    delayedOrders: OrderResponseDTO[],
    refusedOrders: OrderResponseDTO[]
  ) {
    this.allOrders = allOrders;
    this.pendingOrders = pendingOrders;
    this.takeOnOrders = takeOnOrders;
    this.deliveredOrders = deliveredOrders;
    this.delayedOrders = delayedOrders;
    this.refusedOrders = refusedOrders;
  }
}
