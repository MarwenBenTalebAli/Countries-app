// Modules imports
import { NotificationService } from './../../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

// Components imports
import { DeleteDialogComponent } from './../../../delete-dialog/delete-dialog.component';

// Models and services imports
import { City } from './../city.model';
import { CityService } from './../services/city.service';
import { Country } from './../../country/country.model';
import { CountryService } from './../../country/services/country.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-city-form',
  templateUrl: './city-form.component.html',
  styleUrls: ['./city-form.component.css']
})
export class CityFormComponent implements OnInit {

  // HTTP status code
  readonly NOT_FOUND_ERROR = 404;
  readonly CONFLICT_ERROR = 409;
  readonly INTERNAL_SERVER_ERROR = 500;

  private title = 'City Form';
  private city: City;
  private form: FormGroup;
  private ids;

  // Country Select
  private countrysData: Country[];
  private selectedCountryId: number;

  constructor(
    private _countryService: CountryService,
    private _cityService: CityService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _notificationService: NotificationService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.getIdFromRouteParams();
    this.fetchCountrys();
    this.initForm();
  }

  getTitle = () => this.title;

  getIdFromRouteParams = () => {
    this._route.params.subscribe(p => {
        this.ids = _.values(p);
    });
  }

  fetchCountrys = () => {
    this._countryService.getAll().subscribe(
      (data: Country[]) => this.countrysData = data,
      error => console.error(error));
  }

  initForm = () => {
    this.form = this._formBuilder.group(this.getNewForm());
    if (!_.isEmpty(this.ids)) {
      this.load();
    }
  }

  getNewForm = (city?: City) => {
    return {
      id: [{
          value: (city ? city.id : ''),
          disabled: true
      }],      name: [
        (city ? city.name : ''),
        Validators.required
      ],
      countrycode: [
        (city ? city.countrycode : ''),
        Validators.required
      ],
      district: [
        (city ? city.district : ''),
        Validators.required
      ],
      population: [
        (city ? city.population : ''),
        Validators.required
      ]
    };
  }


  load = () => {
    this._cityService.getSingle(this.ids).subscribe(
      (city: City) => {
        this.city = {
          id: city.id,
          name: city.name,
          countrycode: city.countrycode,
          district: city.district,
          population: city.population
		};
        this.form = this._formBuilder.group(this.getNewForm(this.city));
      },
      error => {
        if (error.status === this.NOT_FOUND_ERROR) {
          this._notificationService.error(error.statusText, 'Entity not found in database');
        } else if (error.status === this.INTERNAL_SERVER_ERROR) {
          this._notificationService.error(error.statusText, error.json());
        } else {
          this._notificationService.error('Error', 'An error occured when trying to reach the server');
        }
      });
  }

  save = () => {
	// If we didn't get a city, we are adding a city
    if (!this.city) {
      this.add();
    } else { // If we didn't get a city, we are adding a city
      this.update();
    }
  }

  add = () => {
    this._cityService.add(this.form.value).subscribe(
      result => {
        this._notificationService.success('Success', 'City added successfuly');
        this._router.navigate(['./city-form', this.form.value.id]);
      },
      error => {1
        if (error.status === this.CONFLICT_ERROR) {
          this._notificationService.error(error.statusText, 'Id already used in database');
        } else if (error.status === this.INTERNAL_SERVER_ERROR) {
          this._notificationService.error(error.statusText, error.json());
        } else {
          this._notificationService.error('Error', 'An error occured when trying to reach the server');
        }
      });
  }

  update = () => {
    this._cityService.update(<City>this.form.getRawValue(), this.ids).subscribe(
      result => this._notificationService.success('Success', 'City edited successfuly'),
      error => {
        if (error.status === this.NOT_FOUND_ERROR) {
          this._notificationService.error(error.statusText, 'Entity not found in database');
        } else if (error.status === this.INTERNAL_SERVER_ERROR) {
          this._notificationService.error(error.statusText, error.json());
        } else {
          this._notificationService.error('Error', 'An error occured when trying to reach the server');
        }
      });
  }

  deleteConfirmation = () => {
    if (this.city.id) {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: `city: ${this.city.id}`
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteBadge(this.city.id);
        }
      });
    }
  }

  deleteBadge = (id): void => {
    // Call delete service
    this._cityService.delete(id).subscribe(
      result => {
        this._router.navigate(['./city-list']);

        this._notificationService.success(
          'Deleted',
          `The city entry with the id(s)='${id}' was deleted successfuly`);
      },
      error => {
        if (error.status === this.NOT_FOUND_ERROR) {
          this._notificationService.error(error.statusText, 'Entity not found in database');
        } else if (error.status === this.INTERNAL_SERVER_ERROR) {
          this._notificationService.error(error.statusText, error.json());
        } else {
          this._notificationService.error('Error', 'An error occured when trying to reach the server');
        }
      });
  }
}
