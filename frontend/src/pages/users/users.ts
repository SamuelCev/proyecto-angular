import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService, UserListItem } from '../../service/users';

@Component({
  selector: 'app-users',
  imports: [FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  private usersService = inject(UsersService);

  users = signal<UserListItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  searchQuery = signal('');

  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.users();

    return this.users().filter((user) =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.usersService.getAll().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de usuarios.');
        this.users.set([]);
        this.loading.set(false);
      },
    });
  }
}
