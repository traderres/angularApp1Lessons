import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddReportComponent } from './reports/add-report/add-report.component';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import { WelcomeComponent } from './welcome/welcome.component';
import { ViewReportsComponent } from './reports/view-reports/view-reports.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import { NotFoundComponent } from './not-found/not-found.component';
import {RouterModule, Routes} from "@angular/router";
import {FlexLayoutModule} from "@angular/flex-layout";
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { Chart1Component } from './analytics/chart1/chart1.component';
import { Chart2Component } from './analytics/chart2/chart2.component';
import { UserNavbarComponent } from './user-navbar/user-navbar.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import { AddReport2Component } from './reports/add-report2/add-report2.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { ErrorDialogComponent } from './errorHandler/error-dialog/error-dialog.component';
import {ErrorInterceptor} from "./errorHandler/error.interceptor";
import { EditReportComponent } from './reports/edit-report/edit-report.component';
import {FileUploadModule} from "ng2-file-upload";
import { UploadReportComponent } from './reports/upload-report/upload-report.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { LongViewInnerReportComponent } from './reports/long-view-inner-report/long-view-inner-report.component';
import { LongViewOuterReportComponent } from './reports/long-view-outer-report/long-view-outer-report.component';
import { LongViewInternalNavReportComponent } from './reports/long-view-internal-nav-report/long-view-internal-nav-report.component';
import { DashboardComponent } from './analytics/dashboard/dashboard.component';
import {MatGridListModule} from "@angular/material/grid-list";
import { HighchartsChartModule } from 'highcharts-angular';
import { UsaMapComponent } from './analytics/usa-map/usa-map.component';

// Setup the routes.  If no route is found, then take the user to the NotFoundComponent
const appRoutes: Routes = [
  { path: 'page/addReport',    component: AddReportComponent },
  { path: 'page/addReport2',    component: AddReport2Component },
  { path: 'page/viewReports',  component: ViewReportsComponent },
  { path: 'page/dashboard',    component: DashboardComponent },
  { path: 'page/usa-map',      component: UsaMapComponent },
  { path: 'page/longView/:id',  component: LongViewInternalNavReportComponent },
  { path: 'page/editReport/:id', component: EditReportComponent },
  { path: 'page/uploadReport', component: UploadReportComponent },
  { path: 'page/chart1',       component: Chart1Component },
  { path: 'page/chart2',       component: Chart2Component },
  { path: 'page/longReport',     component: LongViewOuterReportComponent },
  { path: '',                  component: WelcomeComponent},
  { path: '**',                component: NotFoundComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    AddReportComponent,
    WelcomeComponent,
    ViewReportsComponent,
    NotFoundComponent,
    HeaderComponent,
    NavbarComponent,
    Chart1Component,
    Chart2Component,
    UserNavbarComponent,
    AddReport2Component,
    ErrorDialogComponent,
    EditReportComponent,
    UploadReportComponent,
    LongViewInnerReportComponent,
    LongViewOuterReportComponent,
    LongViewInternalNavReportComponent,
    DashboardComponent,
    UsaMapComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FileUploadModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    HighchartsChartModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'standard' } },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
