import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  constructor(readonly auth: AuthService) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn && !this.auth.currentUser()) {
      this.auth.loadCurrentUser().subscribe();
    }
  }
}
