import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable, empty } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { TrainDetail } from '../common/model';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  public trains: Array<TrainDetail>

  constructor(private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.initializeForm();
    this.minDate = new Date();
    this.stations = ['Stony Brook', 'New York', 'Las Vegas', 'Los Angeles', 'San Fransisco'];
    this.fromFilteredStations = this.from.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.toFilteredStations = this.to.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
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
    const fromStation = this.from.value;
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
      this.loader = true;
      setTimeout(() => {
        this.trains = new Array();
        let train: TrainDetail = new TrainDetail();
        train.name = 'Ronkonkoma';
        train.startTime = '11:30 AM';
        train.endTime = '12:30 PM';
        train.originStation = 'Penn Station';
        this.trains.push(train);
        train = new TrainDetail();
        train.name = 'Port Jefferson';
        train.startTime = '11:45 AM';
        train.endTime = '1:00 PM';
        train.originStation = 'Jamaica';
        this.trains.push(train);
        this.loader = false;
        this.displayResults = true;
      }, 2000);
    }
  }

}
