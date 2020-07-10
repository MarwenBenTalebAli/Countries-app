import { GenericService } from './../../../services/generic.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Countrylanguage } from '../countrylanguage.model';
import { Configuration } from '../../../app.configuration';

@Injectable()
export class CountrylanguageService extends GenericService<Countrylanguage>  {

    /**
     * Constructor
     * @param _http Http
     * @param _configuration Configuration
     */
    constructor(_http: Http, _configuration: Configuration) {
        super(_http, _configuration, 'countrylanguage/');
    }

}
