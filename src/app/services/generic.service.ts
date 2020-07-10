import { Configuration } from './../app.configuration';
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

export abstract class GenericService<T> {

    protected headers: Headers;
    protected actionUrl: string;

    constructor(private _http: Http, private _configuration: Configuration, private url: string) {
        this.actionUrl = _configuration.serverWithApiUrl + url;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }

    /**
     * Get all object by the GET Rest service
     * @return promise
     */
    public getAll = (): Observable<T[]> => {
        return this._http.get(this.actionUrl)
            .map((response: Response) => response.json() as T[])
            .catch(this.handleError);
    }

    /**
     * Get the object by the GET/:id Rest service
     * @param keys array of Identifiers
     * @return promise
     */
    public getSingle = (keys: any[]): Observable<T> => {
        return this._http.get(this.actionUrl + this.getKeysUrl(keys))
            .map((response: Response) => response.json() as T)
            .catch(this.handleError);
    }

    /**
     * Add the object by the POST Rest service
     * @param newT The object to POST
     * @param t Object to update
     * @return promise
     */
    public add = (newT: T): Observable<T> => {
        return this._http.post(this.actionUrl, JSON.stringify(newT), { headers: this.headers })
            .map((response: Response) => response.json() as T)
            .catch(this.handleError);
    }

    /**
     * Update the object by the UPDATE Rest service
     * @param t Object to update
     * @param keys array of Identifiers
     * @return promise
     */
    public update = (t: T, keys: any[]): Observable<T> => {
        return this._http.put(this.actionUrl + this.getKeysUrl(keys), JSON.stringify(t), { headers: this.headers })
            .catch(this.handleError);
    }

    /**
     * Delete the object by the DELETE Rest service
     * @param keys array of Identifiers
     * @return promise
     */
    public delete = (...keys: any[]): Observable<Response> => {
        return this._http.delete(this.actionUrl + this.getKeysUrl(keys))
            .catch(this.handleError);
    }

    // Function to throw errors
    private handleError(error: Response) {
        return Observable.throw(error);
    }

    /**
     * Function to return the url of many identifiers
     * @param keys array of Identifiers
     * @return promise
     */
    private getKeysUrl = (keys: any[]): string => {
        let idsUrl = '';

        keys.forEach(element => {
            idsUrl += `${element}/`;
        });

        return idsUrl;
    }
}
