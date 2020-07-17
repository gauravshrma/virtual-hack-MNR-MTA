import { Component, OnInit, Input } from '@angular/core';
import { TrainDetail } from '../common/model';
import { Router } from '@angular/router';
import { TrainService } from '../service/train.service';

@Component({
  selector: 'app-train-list',
  templateUrl: './train-list.component.html',
  styleUrls: ['./train-list.component.scss']
})
export class TrainListComponent implements OnInit {

  @Input() trains: Array<any>

  @Input() toStation: string

  // @Input() trains: Array<TrainDetail>

  constructor(private router: Router,
    private service: TrainService) { }

  ngOnInit(): void {
  }

  getTrack(train: TrainDetail): string {
    let track = train.Track;
    if(!track || track.trim().length == 0) {
      track = train.TrackConn1;
      if(!track || track.trim().length == 0) {
        track = train.TrackConn2;
      }
    }

    if(track && track.trim().length > 0) {
      return track;
    }
    return "NA";
  }

  getDepartureTime(train: TrainDetail): string {
    let dep: string = train.OriginETA;
    if (dep && (dep.indexOf('PM') > 0 || dep.indexOf('AM') > 0)) {
      return dep;
    }
    return 'NA';
  }

  selectTrain(train: any) {
    console.log(train);
    this.service.train = train;
    this.router.navigate(['/train-detail']);
  }

}
