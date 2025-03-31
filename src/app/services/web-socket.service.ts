import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket?: WebSocket;
  private messageSubject = new Subject<any>();

  public connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket message:', data);
      this.messageSubject.next(data);
    };

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  public onMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }
}
