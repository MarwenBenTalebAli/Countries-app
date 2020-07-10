import { Router, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { AboutComponent } from './about/about.component';
import { HomeListComponent } from './home-list/home-list.component';

// City
import { CityListComponent } from './entities/city/city-list/city-list.component';
import { CityFormComponent } from './entities/city/city-form/city-form.component';

// Country
import { CountryListComponent } from './entities/country/country-list/country-list.component';
import { CountryFormComponent } from './entities/country/country-form/country-form.component';

// Countrylanguage
import { CountrylanguageListComponent } from './entities/countrylanguage/countrylanguage-list/countrylanguage-list.component';
import { CountrylanguageFormComponent } from './entities/countrylanguage/countrylanguage-form/countrylanguage-form.component';

export const routing = RouterModule.forRoot([
    { path: '', component: HomeListComponent },
    { path: 'city-list', component: CityListComponent },
    { path: 'city-form/:id', component: CityFormComponent },
    { path: 'city-form', component: CityFormComponent },
    { path: 'country-list', component: CountryListComponent },
    { path: 'country-form/:id', component: CountryFormComponent },
    { path: 'country-form', component: CountryFormComponent },
    { path: 'countrylanguage-list', component: CountrylanguageListComponent },
	{ path: 'countrylanguage-form/:id1/:id2', component: CountrylanguageFormComponent },
    { path: 'countrylanguage-form', component: CountrylanguageFormComponent },
    { path: 'about', component: AboutComponent },
    { path: '**', component: NotFoundComponent }
]);