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

  @Input() trains: Array<TrainDetail>

  constructor(private router: Router,
    private service: TrainService) { }

  ngOnInit(): void {
  }

  selectTrain(train: TrainDetail) {
    console.log(train);
    this.service.train = train;
    this.router.navigate(['/train-detail']);
  }

}
