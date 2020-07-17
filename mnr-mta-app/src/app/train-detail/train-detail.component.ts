import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrainService } from '../service/train.service';
import { TrainDetail, TrainDensityRequest } from '../common/model';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-train-detail',
  templateUrl: './train-detail.component.html',
  styleUrls: ['./train-detail.component.scss']
})
export class TrainDetailComponent implements OnInit {

  public train: TrainDetail;
  public cars: Array<any>;
  public loader = true;

  constructor(private service: TrainService,
    private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    this.train = this.service.train;
    let request = new TrainDensityRequest();

    request.Origin = this.train.Origin;
    request.Destination = this.train.Destination;
    request.DateAsString = this.train.DateAsString;
    request.TrainName = this.train.TrainName;
    request.OriginTime = this.train.OriginTime;
    request.TrainNameConn1 = this.train.TrainNameConn1;
    request.TrainNameConn2 = this.train.TrainNameConn2;

    this.service.trainDensity(request).pipe(
      finalize(() => {
        this.loader = false;
      })
    )
    .subscribe(
      response => {
        console.log(response);
        this.cars = new Array<any>();
        let trains: Array<any> = response.train_density.car_population_density[0];
        console.log(trains);
        if(trains && trains['train'] && trains['train'].length > 0) {
          const obj: Object = trains['train'][0];
          Object.keys(obj).forEach(key => this.cars.push(obj[key].density));
          // for(let i = 0; i < trains['train'].length; i++) {
          //   this.cars.push(trains['train'][i]);
          // }
        }

        if(this.cars.length == 0) {
          this.snackBar.open('Train passenger density information not available', 'OK');
        }
        console.log(this.cars);
      }, error => {
        console.error(error);
        this.snackBar.open('Train passenger density information not available', 'OK');
      }
    );
  }

}
