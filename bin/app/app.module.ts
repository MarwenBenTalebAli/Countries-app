import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';

// Routing
import { routing } from './app.routing';

// City Components
import { CityListComponent } from './entities/city/city-list/city-list.component';
import { CityFormComponent } from './entities/city/city-form/city-form.component';

// Country Components
import { CountryListComponent } from './entities/country/country-list/country-list.component';
import { CountryFormComponent } from './entities/country/country-form/country-form.component';

// Countrylanguage Components
import { CountrylanguageListComponent } from './entities/countrylanguage/countrylanguage-list/countrylanguage-list.component';
import { CountrylanguageFormComponent } from './entities/countrylanguage/countrylanguage-form/countrylanguage-form.component';

// Other Components
import { NotFoundComponent } from './not-found/not-found.component';
import { AboutComponent } from './about/about.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { HomeListComponent } from './home-list/home-list.component';

// Modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { MatNativeDateModule } from '@angular/material';
import { MaterialModule } from './material.module';

// Services
import { Configuration } from './app.configuration';
import { CityService } from './entities/city/services/city.service';
import { CountryService } from './entities/country/services/country.service';
import { CountrylanguageService } from './entities/countrylanguage/services/countrylanguage.service';
import { EmitterService } from './services/emitter.service';
import { NotificationService } from './services/notification.service';
import { PagerService } from './services/pager.service';

@NgModule({
  declarations: [
    AppComponent,
    CityListComponent,
    CityFormComponent,
    CountryListComponent,
    CountryFormComponent,
    CountrylanguageListComponent,
    CountrylanguageFormComponent,
    NotFoundComponent,
    AboutComponent,
    DeleteDialogComponent,
    HomeListComponent
],
  entryComponents: [
    DeleteDialogComponent
],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    BrowserAnimationsModule,
    MaterialModule,
    MatNativeDateModule,
    SimpleNotificationsModule.forRoot()
],
  providers: [
    CityService,
    CountryService,
    CountrylanguageService,
    Configuration,
    EmitterService,
    NotificationService,
    PagerService
],
  bootstrap: [AppComponent]
})
export class AppModule { }
