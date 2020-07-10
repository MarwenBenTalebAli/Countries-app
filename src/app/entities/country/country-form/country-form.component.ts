// Modules imports
import { NotificationService } from './../../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

// Components imports
import { DeleteDialogComponent } from './../../../delete-dialog/delete-dialog.component';

// Models and services imports
import { Country } from './../country.model';
import { CountryService } from './../services/country.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-country-form',
  templateUrl: './country-form.component.html',
  styleUrls: ['./country-form.component.css']
})
export class CountryFormComponent implements OnInit {

  // HTTP status code
  readonly NOT_FOUND_ERROR = 404;
  readonly CONFLICT_ERROR = 409;
  readonly INTERNAL_SERVER_ERROR = 500;

  private title = 'Country Form';
  private country: Country;
  private form: FormGroup;
  private ids;

  constructor(
    private _countryService: CountryService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _notificationService: NotificationService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.getIdFromRouteParams();
    this.initForm();
  }

  getIdFromRouteParams = () => {
    this._route.params.subscribe(p => {
        this.ids = _.values(p);
    });
  }

  initForm = () => {
    this.form = this._formBuilder.group(this.getNewForm());
    if (!_.isEmpty(this.ids)) {
      this.load();
    }
  }

  getNewForm = (country?: Country) => {
    return {
      code: [
          (country ? country.code : ''),
          Validators.required
      ],
      name: [
        (country ? country.name : ''),
        Validators.required
      ],
      continent: [
        (country ? country.continent : ''),
        Validators.required
      ],
      region: [
        (country ? country.region : ''),
        Validators.required
      ],
      surfacearea: [
        (country ? country.surfacearea : ''),
        Validators.required
      ],
      indepyear: [
        (country ? country.indepyear : '')
      ],
      population: [
        (country ? country.population : ''),
        Validators.required
      ],
      lifeexpectancy: [
        (country ? country.lifeexpectancy : '')
      ],
      gnp: [
        (country ? country.gnp : '')
      ],
      gnpold: [
        (country ? country.gnpold : '')
      ],
      localname: [
        (country ? country.localname : ''),
        Validators.required
      ],
      governmentform: [
        (country ? country.governmentform : ''),
        Validators.required
      ],
      headofstate: [
        (country ? country.headofstate : '')
      ],
      capital: [
        (country ? country.capital : '')
      ],
      code2: [
        (country ? country.code2 : ''),
        Validators.required
      ]
    };
  }


  load = () => {
    this._countryService.getSingle(this.ids).subscribe(
      (country: Country) => {
        this.country = {
          code: country.code,
          name: country.name,
          continent: country.continent,
          region: country.region,
          surfacearea: country.surfacearea,
          indepyear: country.indepyear,
          population: country.population,
          lifeexpectancy: country.lifeexpectancy,
          gnp: country.gnp,
          gnpold: country.gnpold,
          localname: country.localname,
          governmentform: country.governmentform,
          headofstate: country.headofstate,
          capital: country.capital,
          code2: country.code2
		};
        this.form = this._formBuilder.group(this.getNewForm(this.country));
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
	// If we didn't get a country, we are adding a country
    if (!this.country) {
      this.add();
    } else { // If we didn't get a country, we are adding a country
      this.update();
    }
  }

  add = () => {
    this._countryService.add(this.form.value).subscribe(
      result => {
        this._notificationService.success('Success', 'Country added successfuly');
        this._router.navigate(['./country-form', this.form.value.code]);
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
    this._countryService.update(<Country>this.form.getRawValue(), this.ids).subscribe(
      result => this._notificationService.success('Success', 'Country edited successfuly'),
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
    if (this.country.code) {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: `country: ${this.country.code}`
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteBadge(this.country.code);
        }
      });
    }
  }

  deleteBadge = (code): void => {
    // Call delete service
    this._countryService.delete(code).subscribe(
      result => {
        this._router.navigate(['./country-list']);

        this._notificationService.success(
          'Deleted',
          `The country entry with the id(s)='${code}' was deleted successfuly`);
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
