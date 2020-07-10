import { NotificationService } from './services/notification.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title: String = 'Home';

  public navigation = [
		{ title: 'City', routerLink: 'city-list' },
		{ title: 'Country', routerLink: 'country-list' },
		{ title: 'Countrylanguage', routerLink: 'countrylanguage-list' }
  ];

  public optionsForNotifications = {
    position: ['bottom', 'left'],
    timeOut: 5000,
    lastOnBottom: true,
    showProgressBar: false,
    pauseOnHover: false,
    clickToClose: true,
    preventDuplicates: true
  };

  constructor(
    private _notificationService: NotificationService) { }

  ngOnInit() {
    this._notificationService.init();
  }
}
