import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  isAdminRoute = false;

  constructor(readonly auth: AuthService, private readonly router: Router) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn && !this.auth.currentUser()) {
      this.auth.loadCurrentUser().subscribe();
    }

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      this.isAdminRoute = e.urlAfterRedirects.startsWith('/admin');
    });
  }
}
