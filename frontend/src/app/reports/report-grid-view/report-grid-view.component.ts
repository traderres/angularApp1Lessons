import { Component, OnInit } from '@angular/core';
import "ag-grid-enterprise";
import {GridService} from "../../services/grid.service";
import {ReportRowDataDTO} from "../../models/report-row-data-dto";
import {ColumnApi, GridApi} from "ag-grid-community";

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

  public rowData: ReportRowDataDTO[];
  private gridApi: GridApi;
  private gridColumnApi: ColumnApi;


  constructor(private gridService: GridService) {}


  ngOnInit(): void {
  }


  public onGridReady(params: any): void {
    // Get a reference to the gridApi and gridColumnApi (which we will need later to get selected rows)
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // Show the loading overlay
    this.gridApi.showLoadingOverlay();

    // Invoke a REST call to get data for the initial page load
    this.gridService.getReportData().subscribe((aData: ReportRowDataDTO[]) => {
      // We got data from the REST call

      // Put the data into the grid
      this.rowData = aData;

      // Resize the columns
      this.gridApi.sizeColumnsToFit();

      // Reset row heights
      this.gridApi.resetRowHeights();

      // Tell the grid to resize when user resizes the browser window
      window.onresize = () => {
        this.gridApi.sizeColumnsToFit();
      }

    });

  }  // end of onGridReady()


}
