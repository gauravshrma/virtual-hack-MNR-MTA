import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TrainDetail, TrainRequest } from '../common/model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrainService {

  public train: any;

  public fromStation: string;

  public toStation: string;

  public date: Date;

  public trains: Array<any>;

  constructor(private httpClient: HttpClient) { }

  public trainDensity(request: any): Observable<any> {
    return this.httpClient.post(environment.url + '/train_density', request, HEADERS);
  }


  public stations$: Observable<Array<string>> = this.httpClient
    .get<any>(environment.url + '/station_list')
    .pipe(
      map((response) => response.stations_list)
    );

  public searchTrains(request: TrainRequest): Observable<any> {
    return this.httpClient.post(environment.url + '/train_list', request, HEADERS);
  }

}

const HEADERS =  {
  headers: new  HttpHeaders({ 
    'Content-Type': 'application/json'})
};