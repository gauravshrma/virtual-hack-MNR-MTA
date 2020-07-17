import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchTrainsComponent } from './search-trains/search-trains.component';
import { TrainDetailComponent } from './train-detail/train-detail.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SearchTrainsComponent
  },
  {
    path: 'train-detail',
    component: TrainDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
