import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { IonContent } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-telegram',
  templateUrl: './telegram.component.html',
  styleUrls: ['./telegram.component.scss'],
  imports: [CommonModule, IonContent, FormsModule],
})
export class TelegramComponent implements OnInit, OnDestroy {
  userName: string = '';
  telegramId: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchTelegramId();
  }

  fetchTelegramId() {
    const token = localStorage.getItem('accessToken');
    this.http
      .get<{ telegramId: string }>(`${environment.apiUrl}/telegram-id`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .subscribe({
        next: (response) => {
          this.telegramId = response.telegramId || ''; // Ensure telegramId is patched
          console.log('Telegram ID:', this.telegramId);
        },
        error: (err) => {
          console.error('Failed to fetch Telegram ID', err);
        },
      });
  }

  updateTelegramId() {
    const token = localStorage.getItem('accessToken');
    this.http
      .put(
        `${environment.apiUrl}/update-telegram-id`,
        { telegramId: this.telegramId }, // Only send the telegramId in the payload
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      )
      .subscribe({
        next: () => {
          alert('Telegram ID updated successfully!');
        },
        error: (err) => {
          console.error('Failed to update Telegram ID', err);
        },
      });
  }

  onLogout() {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/auth']);
  }

  ngOnDestroy(): void {
    console.log('Telegram component destroyed');
    this.telegramId = '';
  }
}
