import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [IonContent],
})
export class HomePageComponent implements OnInit {
  currentHeartRate = 120;
  displayValue: Subject<number> = new Subject<number>();
  displayValueNumber: number = 0; // Add this variable to store the emitted value

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private wsService: WebSocketService
  ) {
    this.wsService.connect(environment.wsUrl);
    this.wsService.onMessage().subscribe((data) => {
      // Update the variable with the emitted value
      this.displayValueNumber = data.value;
      this.displayValue.next(data);
    });
  }

  ngOnInit() {
    this.updateAnimationSpeed(this.currentHeartRate);
  }

  updateAnimationSpeed(heartRate: number) {
    // Convert heart rate to animation speed (higher BPM -> faster animation)
    let animationTime = Math.max(0.8, 3 - heartRate / 100) + 's';

    // Apply to CSS variable
    this.renderer.setStyle(
      document.documentElement,
      '--heart-speed',
      animationTime
    );
  }

  // Example: Call this method when heart rate changes dynamically
  changeHeartRate(newRate: number) {
    this.currentHeartRate = newRate;
    this.updateAnimationSpeed(newRate);
  }
}
