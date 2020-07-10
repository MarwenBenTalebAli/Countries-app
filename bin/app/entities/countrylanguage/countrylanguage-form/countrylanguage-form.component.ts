// Modules imports
import { NotificationService } from './../../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

// Components imports
import { DeleteDialogComponent } from './../../../delete-dialog/delete-dialog.component';

// Models and services imports
import { Countrylanguage } from './../countrylanguage.model';
import { CountrylanguageService } from './../services/countrylanguage.service';
import { Country } from './../../country/country.model';
import { CountryService } from './../../country/services/country.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-countrylanguage-form',
  templateUrl: './countrylanguage-form.component.html',
  styleUrls: ['./countrylanguage-form.component.css']
})
export class CountrylanguageFormComponent implements OnInit {

  // HTTP status code
  readonly NOT_FOUND_ERROR = 404;
  readonly CONFLICT_ERROR = 409;
  readonly INTERNAL_SERVER_ERROR = 500;

  private title = 'Countrylanguage Form';
  private countrylanguage: Countrylanguage;
  private form: FormGroup;
  private ids;

  // Country Select
  private countrysData: Country[];
  private selectedCountryId: number;

  constructor(
    private _countryService: CountryService,
    private _countrylanguageService: CountrylanguageService,
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

  getNewForm = (countrylanguage?: Countrylanguage) => {
    return {
      countrycode: [
        (countrylanguage ? countrylanguage.countrycode : ''),
        Validators.required
      ],
      language: [
          (countrylanguage ? countrylanguage.language : ''),
          Validators.required
      ],
      isofficial: [
        (countrylanguage ? countrylanguage.isofficial : ''),
        Validators.required
      ],
      percentage: [
        (countrylanguage ? countrylanguage.percentage : ''),
        Validators.required
      ]
    };
  }


  load = () => {
    this._countrylanguageService.getSingle(this.ids).subscribe(
      (countrylanguage: Countrylanguage) => {
        this.countrylanguage = {
          countrycode: countrylanguage.countrycode,
          language: countrylanguage.language,
          isofficial: countrylanguage.isofficial,
          percentage: countrylanguage.percentage
		};
        this.form = this._formBuilder.group(this.getNewForm(this.countrylanguage));
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
	// If we didn't get a countrylanguage, we are adding a countrylanguage
    if (!this.countrylanguage) {
      this.add();
    } else { // If we didn't get a countrylanguage, we are adding a countrylanguage
      this.update();
    }
  }

  add = () => {
    this._countrylanguageService.add(this.form.value).subscribe(
      result => {
        this._notificationService.success('Success', 'Countrylanguage added successfuly');
        this._router.navigate(['./countrylanguage-form', this.form.value.countrycode, this.form.value.language]);
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
    this._countrylanguageService.update(<Countrylanguage>this.form.getRawValue(), this.ids).subscribe(
      result => this._notificationService.success('Success', 'Countrylanguage edited successfuly'),
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
    if (this.countrylanguage.countrycode && this.countrylanguage.language) {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: `countrylanguage: ${this.countrylanguage.countrycode}, ${this.countrylanguage.language}`
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteBadge(this.countrylanguage.countrycode, this.countrylanguage.language);
        }
      });
    }
  }

  deleteBadge = (countrycode, language): void => {
    // Call delete service
    this._countrylanguageService.delete(countrycode, language).subscribe(
      result => {
        this._router.navigate(['./countrylanguage-list']);

        this._notificationService.success(
          'Deleted',
          `The countrylanguage entry with the id(s)='${countrycode}, ${language}' was deleted successfuly`);
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
