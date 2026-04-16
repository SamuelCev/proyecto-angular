import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-stock-badge',
  templateUrl: './stock-badge.html',
})
export class StockBadge {
  @Input() stock: number = 0;

  // Emite cuando el usuario hace click en un badge de stock bajo,
  // para que el padre pueda reaccionar (ej. aplicar un filtro)
  @Output() badgeClick = new EventEmitter<void>();
}
