import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [IonContent],
})
export class HomePageComponent implements OnInit {
  currentHeartRate = 120;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

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
