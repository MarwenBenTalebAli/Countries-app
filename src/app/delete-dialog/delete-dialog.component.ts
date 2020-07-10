import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-dialog',
  template: `
    <h2 mat-dialog-title>Delete {{ data }}</h2>
    <mat-dialog-content>Are you sure?</mat-dialog-content>
    <mat-dialog-actions>
        <button mat-button mat-dialog-close>No</button>
        <button mat-button [mat-dialog-close]="true">Yes</button>
    </mat-dialog-actions>
  `
})
export class DeleteDialogComponent {

  constructor(
      public dialogRef: MatDialogRef<DeleteDialogComponent>, 
      @Inject(MAT_DIALOG_DATA) public data: any) { }
}