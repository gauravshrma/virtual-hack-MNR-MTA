import { Component, OnInit } from '@angular/core';
import { TrainService } from '../service/train.service';
import { TrainDetail } from '../common/model';

@Component({
  selector: 'app-train-detail',
  templateUrl: './train-detail.component.html',
  styleUrls: ['./train-detail.component.scss']
})
export class TrainDetailComponent implements OnInit {

  public train: TrainDetail;

  constructor(private service: TrainService) { }

  ngOnInit(): void {
    this.train = this.service.train;
  }

}
