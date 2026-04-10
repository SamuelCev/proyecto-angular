import { Component, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Header } from '../components/header/header';
import { Sidebar } from '../components/sidebar/sidebar';
import { Auth } from '../service/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);
  protected showLayout = false;

  ngOnInit() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.showLayout = !e.urlAfterRedirects.startsWith('/login');
      });

    this.auth.loadUser();
  }
}
