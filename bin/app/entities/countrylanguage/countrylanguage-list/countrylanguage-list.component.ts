// Modules imports
import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

// Services imports
import { PagerService } from './../../../services/pager.service';
import { EmitterService } from './../../../services/emitter.service';
import { NotificationService } from './../../../services/notification.service';
import { CountrylanguageService } from './../services/countrylanguage.service';

// Models imports
import { Countrylanguage } from '../countrylanguage.model';

// Components imports
import { DeleteDialogComponent } from './../../../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-countrylanguage-list',
  templateUrl: './countrylanguage-list.component.html',
  styleUrls: ['./countrylanguage-list.component.css']
})
export class CountrylanguageListComponent implements OnInit, OnChanges {

  private listOfCountrylanguages: Countrylanguage[];
  private listId = 'COUNTRYLANGUAGE_COMPONENT_LIST';

  private title = 'List of Countrylanguages';

  // pager object
  private pager: any = {};
  // paged items
  private pagedItems: any[];

  constructor(
    private _countrylanguageService: CountrylanguageService,
    private _router: Router,
    private _notificationService: NotificationService,
    private pagerService: PagerService,
    public dialog: MatDialog) { }

  ngOnInit() {
    // On init get all Countrylanguages
    this.getAllCountrylanguages();

    // Listen to the 'list' emitted event so as populate the model with the event payload
    // Refresh Countrylanguage list
    EmitterService.get(this.listId).subscribe((data: Countrylanguage[]) => this.getAllCountrylanguages());
  }

  ngOnChanges() { }

  /**
   * Get all Countrylanguage using the service CountrylanguageService
   */
  getAllCountrylanguages = (): void => {
    this._countrylanguageService.getAll().subscribe(
      (data: Countrylanguage[]) => {
        this.listOfCountrylanguages = data;
        this.setPage(1);
      },
      error => {
        this._notificationService.error(
          'Error',
          'An error occured when trying to reach the server');
    });
  }

  editCountrylanguage = (countrycode, language): void => {
    // Navigate to countrylanguage form component
    this.goToCountrylanguageForm(countrycode, language);
  }

  deleteCountrylanguage = (countrycode, language): void => {
    // Call delete service
    this._countrylanguageService.delete(countrycode, language).subscribe(
      result => {
        // Notify Countrylanguage list to refresh
        EmitterService.get(this.listId).emit(result);

        this._notificationService.success(
          'Deleted',
          `The countrylanguage entry with the id='${countrycode}, ${language}' was deleted successfuly`);
      },
      error => {
        this._notificationService.error(
          'Error',
          'An error occured when trying to reach the server');
      });
  }

  goToCountrylanguageForm(countrycode, language) {
    this._router.navigate(['./countrylanguage-form', countrycode, language]);
  }

  deleteConfirmation = (countrycode, language) => {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: `countrylanguage: ${countrycode}, ${language}`
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteCountrylanguage(countrycode, language);
      }
    });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.listOfCountrylanguages.length, page);

    // get current page of items
    this.pagedItems = this.listOfCountrylanguages.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}
