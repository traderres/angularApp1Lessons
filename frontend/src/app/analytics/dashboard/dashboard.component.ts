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
import {TileSizeDTO} from "../../models/tile-size-dto";
import {DashboardService} from "../../services/dashboard.service";
import {DashboardDataDTO} from "../../models/dashboard-data-dto";
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


  // Chart 2 is a bar chart2
  private chartOptions2: any = {
    chart: {
      type: 'column'   // Uuse type:'bar' for horizontal chart.  Use type:'column' for vertical bar chart
    },
    credits: {
      enabled: false        // Hide the highcharts.com label
    },
    title: {
      text: 'Case Timeliness of Closes Cases (Days)'
    },
    xAxis: {
      categories: ['0-30', '31-60', '61-90', '91-120', '121-150', '151-180', '181-210', '211-240', '241-270', '271-300', '301+']
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Number of Cases'
      }
    },
    legend: {
      reversed: false
    },
    plotOptions: {
      series: {
        stacking: 'normal'
      }
    },
    series: []
  };



  // Chart 3 is a line chart
  private chartOptions3: any = {
    credits: {
      enabled: false        // Hide the highcharts.com label
    },
    title: {
      text: 'Case Timeliness (Closed Investigations)'
    },
    subtitle: {
      text: ''
    },
    yAxis: {
      title: {
        text: 'Avg Case Timeliness (Days)'
      }
    },
    xAxis: {
      type: 'datetime',
      tickInterval: 30 * 24 * 3600 * 1000,
      labels: {
        rotation: 45,
        step: 1,
        style: {
          fontSize: '13px',
          fontFamily: 'Arial,sans-serif'
        }
      },
      dateTimeLabelFormats: {
        month: '%b \'%y',
        year: '%Y'
      },
      accessibility: {
        rangeDescription: 'Range: The last 12 months'
      }
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        }
      }
    },
    series: []
  }


  public tileSizes: TileSizeDTO[] = [
      {
        chartNumber: 1,
        rowSpan: 1,
        colSpan: 1
      },
    {
      chartNumber: 2,
      rowSpan: 1,
      colSpan: 1
    },
    {
      chartNumber: 3,
      rowSpan: 1,
      colSpan: 1
    },
    {
      chartNumber: 4,
      rowSpan: 1,
      colSpan: 1
    },
    {
      chartNumber: 5,
      rowSpan: 1,
      colSpan: 1
    },
    {
      chartNumber: 6,
      rowSpan: 1,
      colSpan: 1
    }
    ];


  constructor(private breakpointObserver: BreakpointObserver,
              private dashboardService: DashboardService) { }


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

    this.dashboardService.getAllChartData().subscribe( (aData: DashboardDataDTO) => {
        // The REST call came back with data

        // Set the data for chart 1 and *render* chart 1
        this.chartOptions1.series[0].data = aData.chartData1;
        Highcharts.chart('chart1', this.chartOptions1);

        this.chartOptions2.series = aData.chartData2;
        Highcharts.chart('chart2', this.chartOptions2);

        this.chartOptions3.series = aData.chartData3;
        Highcharts.chart('chart3', this.chartOptions3);

    }).add(  () => {
        // REST call finally block

      // Redraw all charts on this page (so they fit perfectly in the <mat-card> tags)
      Highcharts.charts.forEach(function (chart: Chart | undefined) {
          chart?.reflow();
        });

        this.dataIsLoading = false;
    });

  }


  /*
   * Send a 'resize' event
   * This will cause HighCharts to resize all charts to fit inside their parent containers
   */
  private resizeChartsToFitContainers(): void {

    setTimeout(()=> {
      // Send a 'resize' event
      // NOTE:  The window.dispatchEvent() call MUST be in a setTimeout or it will not work
      window.dispatchEvent(new Event('resize'));
    }, 1);

  }


  public toggleSize(aChartNumber: number) {

    // Reset all other tiles to be 1x1
    this.tileSizes.forEach( (tile: TileSizeDTO) => {
      if (tile.chartNumber != aChartNumber) {
        tile.rowSpan = 1;
        tile.colSpan = 1;
      }
    })

    // Get the indexNumber in the array from the chartNumber
    let indexNumber: number = aChartNumber - 1;

    if (this.tileSizes[indexNumber].rowSpan == 1) {
      // This tile is already 1x1.  So, change it to 2x2
      this.tileSizes[indexNumber].rowSpan = 2;
      this.tileSizes[indexNumber].colSpan = 2;
    }
    else {
      // This tile is already 2x2.  So, change it to 1x1
      this.tileSizes[indexNumber].rowSpan = 1;
      this.tileSizes[indexNumber].colSpan = 1;
    }

    // Resize the charts to fit their parent containers
    this.resizeChartsToFitContainers();
  }
}
