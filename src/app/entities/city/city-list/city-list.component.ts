// Modules imports
import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

// Services imports
import { PagerService } from './../../../services/pager.service';
import { EmitterService } from './../../../services/emitter.service';
import { NotificationService } from './../../../services/notification.service';
import { CityService } from './../services/city.service';

// Models imports
import { City } from '../city.model';

// Components imports
import { DeleteDialogComponent } from './../../../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.css']
})
export class CityListComponent implements OnInit, OnChanges {

  private listOfCitys: City[];
  private listId = 'CITY_COMPONENT_LIST';

  private title = 'List of Citys';

  // pager object
  private pager: any = {};
  // paged items
  private pagedItems: any[];

  constructor(
    private _cityService: CityService,
    private _router: Router,
    private _notificationService: NotificationService,
    private pagerService: PagerService,
    public dialog: MatDialog) { }

  ngOnInit() {
    // On init get all Citys
    this.getAllCitys();

    // Listen to the 'list' emitted event so as populate the model with the event payload
    // Refresh City list
    EmitterService.get(this.listId).subscribe((data: City[]) => this.getAllCitys());
  }

  ngOnChanges() { }

  /**
   * Get all City using the service CityService
   */
  getAllCitys = (): void => {
    this._cityService.getAll().subscribe(
      (data: City[]) => {
        this.listOfCitys = data;
        this.setPage(1);
      },
      error => {
        this._notificationService.error(
          'Error',
          'An error occured when trying to reach the server');
    });
  }

  editCity = (id): void => {
    // Navigate to city form component
    this.goToCityForm(id);
  }

  deleteCity = (id): void => {
    // Call delete service
    this._cityService.delete(id).subscribe(
      result => {
        // Notify City list to refresh
        EmitterService.get(this.listId).emit(result);

        this._notificationService.success(
          'Deleted',
          `The city entry with the id='${id}' was deleted successfuly`);
      },
      error => {
        this._notificationService.error(
          'Error',
          'An error occured when trying to reach the server');
      });
  }

  goToCityForm(id) {
    this._router.navigate(['./city-form', id]);
  }

  deleteConfirmation = (id) => {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: `city: ${id}`
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteCity(id);
      }
    });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.listOfCitys.length, page);

    // get current page of items
    this.pagedItems = this.listOfCitys.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}
