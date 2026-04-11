import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MovementsService } from '../../service/movements';
import { Movement } from '@inven-tech/types';

@Component({
  selector: 'app-movements',
  imports: [DatePipe],
  templateUrl: './movements.html',
  styleUrl: './movements.css',
})
export class Movements implements OnInit {
  private movementsService = inject(MovementsService);
  
  movements = signal<Movement[]>([]);

  ngOnInit(): void {
    this.movementsService.getAll().subscribe({
      next: (data) => {
        this.movements.set(data);
      },
      error: (err) => {
        console.error('Error fetching movements', err);
      }
    });
  }
}
