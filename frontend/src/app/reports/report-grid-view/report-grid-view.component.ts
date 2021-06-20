import { Component, OnInit } from '@angular/core';
import "ag-grid-enterprise";

@Component({
  selector: 'app-report-grid-view',
  templateUrl: './report-grid-view.component.html',
  styleUrls: ['./report-grid-view.component.css']
})
export class ReportGridViewComponent implements OnInit {

  public gridOptions: any = {
    debug: true
  };

  public defaultColDefs: any = {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: true,    // Causes the filter row to appear below column names
  };

  public columnDefs = [
    {field: 'id' },
    {field: 'name' },
    {field: 'priority'},
    {field: 'start_date'},
    {field: 'end_date'}
  ];

  public rowData = [

    { id: 1, name: 'Report 1', priority: 'low', 'start_date': '05/01/2019', 'end_date': '05/05/2019'},
    { id: 2, name: 'Report 2', priority: 'medium', 'start_date': '06/01/2019', 'end_date': '06/06/2019'},
    { id: 3, name: 'Report 3', priority: 'high', 'start_date': '07/01/2019', 'end_date': '07/07/2019'},
    { id: 1, name: 'Report 4', priority: 'low', 'start_date': '05/01/2019', 'end_date': '05/05/2019'},
    { id: 2, name: 'Report 5', priority: 'medium', 'start_date': '06/01/2019', 'end_date': '06/06/2019'},
    { id: 3, name: 'Report 6', priority: 'high', 'start_date': '07/01/2019', 'end_date': '07/07/2019'},
    { id: 1, name: 'Report 7', priority: 'low', 'start_date': '05/01/2019', 'end_date': '05/05/2019'},
    { id: 2, name: 'Report 8', priority: 'medium', 'start_date': '06/01/2019', 'end_date': '06/06/2019'},
    { id: 3, name: 'Report 9', priority: 'high', 'start_date': '07/01/2019', 'end_date': '07/07/2019'},
    { id: 1, name: 'Report 10', priority: 'low', 'start_date': '05/01/2019', 'end_date': '05/05/2019'},
    { id: 2, name: 'Report 11', priority: 'medium', 'start_date': '06/01/2019', 'end_date': '06/06/2019'},
    { id: 3, name: 'Report 12', priority: 'high', 'start_date': '07/01/2019', 'end_date': '07/07/2019'},
    { id: 1, name: 'Report 13', priority: 'low', 'start_date': '05/01/2019', 'end_date': '05/05/2019'},
    { id: 2, name: 'Report 14', priority: 'medium', 'start_date': '06/01/2019', 'end_date': '06/06/2019'},
    { id: 3, name: 'Report 15', priority: 'high', 'start_date': '07/01/2019', 'end_date': '07/07/2019'},
    { id: 1, name: 'Report 16', priority: 'low', 'start_date': '05/01/2019', 'end_date': '05/05/2019'},
    { id: 2, name: 'Report 17', priority: 'medium', 'start_date': '06/01/2019', 'end_date': '06/06/2019'},
    { id: 3, name: 'Report 18', priority: 'high', 'start_date': '07/01/2019', 'end_date': '07/07/2019'},
    { id: 1, name: 'Report 19', priority: 'low', 'start_date': '05/01/2019', 'end_date': '05/05/2019'},
    { id: 2, name: 'Report 20', priority: 'medium', 'start_date': '06/01/2019', 'end_date': '06/06/2019'},
    { id: 3, name: 'Report 21', priority: 'high', 'start_date': '07/01/2019', 'end_date': '07/07/2019'},
    { id: 1, name: 'Report 22', priority: 'low', 'start_date': '05/01/2019', 'end_date': '05/05/2019'},
    { id: 2, name: 'Report 23', priority: 'medium', 'start_date': '06/01/2019', 'end_date': '06/06/2019'},
    { id: 3, name: 'Report 24', priority: 'high', 'start_date': '07/01/2019', 'end_date': '07/07/2019'},
    { id: 3, name: 'Report 25', priority: 'high', 'start_date': '07/01/2019', 'end_date': '07/07/2019'}

  ];




  constructor() {}

  ngOnInit(): void {
  }

}
