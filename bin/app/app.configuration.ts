import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    public server = 'http://localhost:8080/countries';
    public apiUrl = '/rest/';
    public serverWithApiUrl = this.server + this.apiUrl;
}
