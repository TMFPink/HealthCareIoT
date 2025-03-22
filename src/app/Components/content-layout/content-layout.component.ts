import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IonIcon, IonRouterOutlet } from '@ionic/angular/standalone';
import { receiptOutline } from 'ionicons/icons';
import { filter } from 'rxjs';
@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
  imports: [CommonModule, NzIconModule, IonIcon, IonRouterOutlet],
})
export class ContentLayoutComponent implements OnInit {
  currentRoute: string = '';
  constructor(private router: Router) {
    addIcons({ receiptOutline });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  ngOnInit() {}

  isRouteActive(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }

  onNavigate(route: string) {
    this.router.navigate([route]);
  }
}
