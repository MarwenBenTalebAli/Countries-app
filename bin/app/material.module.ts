import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatFormFieldControl} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
	imports: [
		MatButtonModule,
		MatGridListModule,
		MatSelectModule,
		MatDialogModule,
		MatInputModule,
		MatFormFieldModule,
		MatIconModule
	],
	exports: [
		MatButtonModule,
		MatGridListModule,
		MatSelectModule,
		MatDialogModule,
		MatInputModule,
		MatFormFieldModule,
		MatIconModule
	],
})
export class MaterialModule { }