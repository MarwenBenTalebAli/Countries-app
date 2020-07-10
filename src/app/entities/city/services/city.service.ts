import { GenericService } from './../../../services/generic.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { City } from '../city.model';
import { Configuration } from '../../../app.configuration';

@Injectable()
export class CityService extends GenericService<City>  {

    /**
     * Constructor
     * @param _http Http
     * @param _configuration Configuration
     */
    constructor(_http: Http, _configuration: Configuration) {
        super(_http, _configuration, 'city/');
    }

}
