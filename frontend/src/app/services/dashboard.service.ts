import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {DashboardDataDTO} from "../models/dashboard-data-dto";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }


  public getAllChartData(): Observable<DashboardDataDTO> {

    let data1 =  [
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

    let data2 = [
      {
        name: 'T3',
        legendIndex: 1,
        data: [300, 5500, 1800, 1600, 1200, 1500, 1000, 800, 500, 400, 1000]
      },
      {
        name: 'T3R',
        legendIndex: 2,
        data: [2, 2, 100, 2, 1]
      },
      {
        name: 'T5',
        legendIndex: 3,
        data: [25, 500, 551, 600, 400, 300, 200, 500, 100, 100, 1200]
      },
      {
        name: 'T5R',
        legendIndex: 4,
        data: [200, 190, 190, 100, 50, 12, 37, 42, 98, 50, 600]
      }
    ];

    let data3 =  [{
      name: 'T3',
      data: [
        [Date.UTC(2019, 6, 1), 110],
        [Date.UTC(2019, 7, 1), 145],
        [Date.UTC(2019, 8, 1), 135],
        [Date.UTC(2019, 9, 1), 140],
        [Date.UTC(2019, 10, 1), 100],
        [Date.UTC(2019, 11, 1), 110],
        [Date.UTC(2019, 12, 1), 100],
        [Date.UTC(2020, 1, 1), 85],
        [Date.UTC(2020, 2, 1), 70],
        [Date.UTC(2020, 3, 1), 65],
        [Date.UTC(2020, 4, 1), 60],
        [Date.UTC(2020, 5, 1), 60]

      ]
    }, {
      name: 'T3R',
      data: [
        [Date.UTC(2019, 6, 1), 175],
        [Date.UTC(2019, 7, 1), 155],
        [Date.UTC(2019, 8, 1), 100],
        [Date.UTC(2019, 9, 1), 115],
        [Date.UTC(2019, 10, 1), 87],
        [Date.UTC(2019, 11, 1), 90],
        [Date.UTC(2019, 12, 1), 88],
        [Date.UTC(2020, 1, 1), 85],
        [Date.UTC(2020, 2, 1), 86],
        [Date.UTC(2020, 3, 1), 75],
        [Date.UTC(2020, 4, 1), 60],
        [Date.UTC(2020, 5, 1), 45]
      ]
    }, {
      name: 'T5',
      data: [
        [Date.UTC(2019, 6, 1), 230],
        [Date.UTC(2019, 7, 1), 225],
        [Date.UTC(2019, 8, 1), 205],
        [Date.UTC(2019, 9, 1), 210],
        [Date.UTC(2019, 10, 1), 212],
        [Date.UTC(2019, 11, 1), 185],
        [Date.UTC(2019, 12, 1), 187],
        [Date.UTC(2020, 1, 1), 150],
        [Date.UTC(2020, 2, 1), 105],
        [Date.UTC(2020, 3, 1), 85],
        [Date.UTC(2020, 4, 1), 85],
        [Date.UTC(2020, 5, 1), 70]
      ]
    }, {
      name: 'T5R',
      data: [
        [Date.UTC(2019, 6, 1), 240],
        [Date.UTC(2019, 7, 1), 238],
        [Date.UTC(2019, 8, 1), 205],
        [Date.UTC(2019, 9, 1), 200],
        [Date.UTC(2019, 10, 1), 160],
        [Date.UTC(2019, 11, 1), 155],
        [Date.UTC(2019, 12, 1), 148],
        [Date.UTC(2020, 1, 1), 140],
        [Date.UTC(2020, 2, 1), 120],
        [Date.UTC(2020, 3, 1), 85],
        [Date.UTC(2020, 4, 1), 75],
        [Date.UTC(2020, 5, 1), 125]
      ]
    }];

    // Create the DashboardDataDTO and populate it
    let dto: DashboardDataDTO = new DashboardDataDTO();
    dto.chartData1 = data1;
    dto.chartData2 = data2;
    dto.chartData3 = data3;

    // Return an observable with the DashboardDataDTo object
    return of(dto);
  }


}
