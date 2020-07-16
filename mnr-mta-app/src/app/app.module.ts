import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { CalendarModule } from 'primeng/calendar';
import { SearchTrainsComponent } from './search-trains/search-trains.component';
import { TrainListComponent } from './train-list/train-list.component';
import { TrainService } from './service/train.service';
import { TrainDetailComponent } from './train-detail/train-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchTrainsComponent,
    TrainListComponent,
    TrainDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    CalendarModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatRippleModule,
    MatSnackBarModule
  ],
  providers: [ TrainService,
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}} ],
  bootstrap: [AppComponent]
})
export class AppModule { }
