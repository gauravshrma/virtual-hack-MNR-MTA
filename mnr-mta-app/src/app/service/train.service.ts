import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TrainDetail } from '../common/model';

@Injectable({
  providedIn: 'root'
})
export class TrainService {

  public train: TrainDetail;

  constructor(private httpClient: HttpClient) { }

}
