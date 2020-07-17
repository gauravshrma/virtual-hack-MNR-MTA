import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable, empty } from 'rxjs';
import {map, startWith, finalize} from 'rxjs/operators';
import { TrainDetail, TrainRequest } from '../common/model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TrainService } from '../service/train.service';

@Component({
  selector: 'app-search-trains',
  templateUrl: './search-trains.component.html',
  styleUrls: ['./search-trains.component.scss']
})
export class SearchTrainsComponent implements OnInit {

  //public form: FormGroup;
  public from: FormControl;
  public to: FormControl;
  public date: Date;
  public stations: Array<string>;
  public fromFilteredStations: Observable<string[]>;
  public toFilteredStations: Observable<string[]>;
  public minDate: Date
  public maxDate: Date;
  public loader: boolean;
  public displayResults: boolean;
  public trains: Array<any>;
  public request: TrainRequest;

  constructor(private snackBar: MatSnackBar,
    private service: TrainService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.minDate = new Date();
  //   this.stations = ['Campbell Hall', 'Harriman', 'Middletown', 'Otisville', 'Port', 'Salisbury', 'Sloatsburg', 'Suffern', 
  // 'Tuxedo'];
    this.service.stations$.subscribe(
      response => {
        this.stations = response;
      }
    )
    this.fromFilteredStations = this.from.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.toFilteredStations = this.to.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    if (this.service.fromStation) {
      this.from.setValue(this.service.fromStation);
    }
    if (this.service.toStation) {
      this.to.setValue(this.service.toStation);
    }
    if (this.service.date) {
      this.date = this.service.date;
    }
    if (this.service.trains) {
      this.trains = this.service.trains;
      this.displayResults = true;
    }
  }

  private _filter(value: string): string[] {
    let filterValue = '';
    if (value) {
      filterValue = value.toLowerCase();
    }
    return this.stations.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  initializeForm() {
    this.from = new FormControl(null);
    this.to = new FormControl(null);
  }

  swap() {
    console.log('swap clicked');
    const fromStation = this.from.value;
    const toStation = this.to.value;
    if(fromStation || toStation) {
      this.from.setValue(toStation);
      this.to.setValue(fromStation);
    }
  }

  onSubmit() {
    const fromStation: string = this.from.value;
    const toStation = this.to.value;
    const time = this.date;

    if(!fromStation) {
      console.error('Please enter the origin station');
      this.snackBar.open('Please enter the origin station', 'OK');
    }
    else if(!toStation) {
      console.error('Please enter your destination');
      this.snackBar.open('Please enter your destination', 'OK');
    }
    else if(!time) {
      console.error('Please set your departure time');
      this.snackBar.open('Please set your departure time', 'OK');
    }
    else if(fromStation === toStation) {
      console.error('Origin and Destination stations should be different');
      this.snackBar.open('Origin and Destination stations should be different', 'OK');
    }
    else if(!this.stations.includes(fromStation)) {
      console.error('Please enter a valid origin station');
      this.snackBar.open('Please enter a valid origin station', 'OK');
    }
    else if(!this.stations.includes(toStation)) {
      console.error('Please enter a valid destination station');
      this.snackBar.open('Please enter a valid destination station', 'OK');
    }
    else {
      console.log('Valid Form Data');
      this.service.fromStation = fromStation;
      this.service.toStation = toStation;
      this.service.date = this.date;
      this.loader = true;

      this.request = new TrainRequest();
      this.request.origin = fromStation;
      this.request.dest = toStation;
      this.request.day = '' + time.getDate();
      this.request.month = '' + (time.getMonth() + 1);
      this.request.year = '' + time.getFullYear();

      this.service.searchTrains(this.request).pipe(
        finalize(() => {
          this.loader = false;
          this.displayResults = true;
          this.service.trains = this.trains;
        })
      )
      .subscribe(
        response => {
          this.trains = response.trains_list;
          console.log(this.trains);
        }, error => {
          console.error(error);
          this.snackBar.open('No trains available at this time', 'OK');
        }
      );
    }
  }

}
