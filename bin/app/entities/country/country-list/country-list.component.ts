// Modules imports
import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

// Services imports
import { PagerService } from './../../../services/pager.service';
import { EmitterService } from './../../../services/emitter.service';
import { NotificationService } from './../../../services/notification.service';
import { CountryService } from './../services/country.service';

// Models imports
import { Country } from '../country.model';

// Components imports
import { DeleteDialogComponent } from './../../../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css']
})
export class CountryListComponent implements OnInit, OnChanges {

  private listOfCountrys: Country[];
  private listId = 'COUNTRY_COMPONENT_LIST';

  private title = 'List of Countrys';

  // pager object
  private pager: any = {};
  // paged items
  private pagedItems: any[];

  constructor(
    private _countryService: CountryService,
    private _router: Router,
    private _notificationService: NotificationService,
    private pagerService: PagerService,
    public dialog: MatDialog) { }

  ngOnInit() {
    // On init get all Countrys
    this.getAllCountrys();

    // Listen to the 'list' emitted event so as populate the model with the event payload
    // Refresh Country list
    EmitterService.get(this.listId).subscribe((data: Country[]) => this.getAllCountrys());
  }

  ngOnChanges() { }

  /**
   * Get all Country using the service CountryService
   */
  getAllCountrys = (): void => {
    this._countryService.getAll().subscribe(
      (data: Country[]) => {
        this.listOfCountrys = data;
        this.setPage(1);
      },
      error => {
        this._notificationService.error(
          'Error',
          'An error occured when trying to reach the server');
    });
  }

  editCountry = (code): void => {
    // Navigate to country form component
    this.goToCountryForm(code);
  }

  deleteCountry = (code): void => {
    // Call delete service
    this._countryService.delete(code).subscribe(
      result => {
        // Notify Country list to refresh
        EmitterService.get(this.listId).emit(result);

        this._notificationService.success(
          'Deleted',
          `The country entry with the id='${code}' was deleted successfuly`);
      },
      error => {
        this._notificationService.error(
          'Error',
          'An error occured when trying to reach the server');
      });
  }

  goToCountryForm(code) {
    this._router.navigate(['./country-form', code]);
  }

  deleteConfirmation = (code) => {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: `country: ${code}`
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteCountry(code);
      }
    });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.listOfCountrys.length, page);

    // get current page of items
    this.pagedItems = this.listOfCountrys.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}
