import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {Subscription} from "rxjs";

import * as Highcharts from "highcharts";    // needed

window.Highcharts = Highcharts;

// Turn on the highchart context menu view/print/download options
import HC_exporting from "highcharts/modules/exporting";
HC_exporting(Highcharts);

// Turn on the highchart context menu *export* options
// NOTE:  This provides these menu options: Download CSV, Download XLS, View Data Table
import HC_exportData from "highcharts/modules/export-data";
HC_exportData(Highcharts);

// Do client-side exporting (so that the exporting does *NOT* go to https://export.highcharts.com/
// NOTE:  This does not work on all web browsers
import HC_offlineExport from "highcharts/modules/offline-exporting";
HC_offlineExport(Highcharts);

// Turn on the drill-down capabilities
import HC_drillDown from "highcharts/modules/drilldown";
import {Chart} from "highcharts";
HC_drillDown(Highcharts);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {


  public totalColumns: number;
  private cardLayoutSubscription: Subscription;
  public dataIsLoading: boolean = false;

  private chartOptions1: any = {
    credits: {
      enabled: false        // Hide the highcharts.com label
    },
    caption: {
      text: ''
    },
    chart: {
      type: 'pie'
    },
    title: {
      text: 'Pending Case Distribution'
    },
    subtitle: {
      text: ''
    },
    accessibility: {
      announceNewData: {
        enabled: true
      },
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>:<br>{point.percentage:.1f} %<br>value: {point.y}'
        }
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> or <b>{point.percentage:.1f}%</b> of total<br/>'
    },
    series: [
      {
        name: "Browsers",
        colorByPoint: true,
        data: []
      }
    ]
  };


  constructor(private breakpointObserver: BreakpointObserver) { }


  public ngOnInit(): void {

    // Set options for all highchart menus on this page
    Highcharts.setOptions( {
      lang: {
        thousandsSep: ','    // Set the thousand separator as a comma
      }
    });

    // Listen on an array of size breakpoints
    // NOTE:  The breakpoints can be min-width or max-width
    this.cardLayoutSubscription = this.breakpointObserver.observe([
      '(min-width: 1px)', '(min-width: 800px)', '(min-width: 1100px)'
    ]).subscribe( (state: BreakpointState) => {

      if (state.breakpoints['(min-width: 1100px)']) {
        console.log("Screen is 1100px or more.  state=", state);
        this.totalColumns = 3;
      }
      else if (state.breakpoints['(min-width: 800px)']) {
        console.log("Screen is 800px-1100px.  state=", state);
        this.totalColumns = 2;
      }
      else if (state.breakpoints['(min-width: 1px)']) {
        console.log("Screen is 1 to 800px.  state=", state);
        this.totalColumns = 1;
      }

    });

  }  // end of ngOnOnit()


  public ngOnDestroy(): void {
    if (this.cardLayoutSubscription) {
      // Unsubscribe from the subscription (to avoid memory leaks)
      this.cardLayoutSubscription.unsubscribe();
    }
  }

  public ngAfterViewInit(): void {
    // Reload chart data
    // NOTE:  This call must be in ngAfterViewInit() and not in ngOnInit()
    this.reloadData();
  }

  public reloadData(): void {
    this.dataIsLoading = true;

    // Update chart 1 with hard-coded data
    this.chartOptions1.series[0].data = [
      {
        name: "Item 3",
        y: 989
      },
      {
        name: "Item 3R",
        y: 249
      },
      {
        name: "Item 5",
        y: 1035
      },
      {
        name: "Item 5R",
        y: 324
      }
    ];
    Highcharts.chart('chart1', this.chartOptions1);


    // Redraw all of the charts on this page (so they fit perfectly within the mat-card tags
    Highcharts.charts.forEach(function (chart: Chart | undefined) {
      chart?.reflow();
    });

    this.dataIsLoading = false;
  }


}
