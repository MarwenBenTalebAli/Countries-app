import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.css']
})
export class HomeListComponent implements OnInit {

  public navigation = [
		{ title: 'City', routerLink: 'city-list' },
		{ title: 'Country', routerLink: 'country-list' },
		{ title: 'Countrylanguage', routerLink: 'countrylanguage-list' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
