import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-stock-badge',
  templateUrl: './stock-badge.html',
})
export class StockBadge {
  @Input() stock: number = 0;

  @Output() badgeClick = new EventEmitter<void>();
}
