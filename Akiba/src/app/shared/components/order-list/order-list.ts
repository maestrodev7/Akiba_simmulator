import { Component, Input } from '@angular/core';
import { orderListItem } from '../../types/util-interface';

@Component({
  selector: 'app-order-list',
  imports: [],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css',
})
export class OrderList {
  @Input() orderItem:orderListItem={} as orderListItem
  @Input() index:number=1
}
