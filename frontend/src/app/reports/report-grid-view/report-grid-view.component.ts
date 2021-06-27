import { Component, OnInit } from '@angular/core';
import "ag-grid-enterprise";
import {GridService} from "../../services/grid.service";
import {ReportRowDataDTO} from "../../models/report-row-data-dto";
import {ColumnApi, GridApi, GridOptions, ICellRendererParams} from "ag-grid-community";
import {PriorityCellCustomRendererComponent} from "./priority-cell-custom-renderer/priority-cell-custom-renderer.component";
import {ReportGridActionCellRendererComponent} from "./report-grid-action-cell-renderer/report-grid-action-cell-renderer.component";

@Component({
  selector: 'app-report-grid-view',
  templateUrl: './report-grid-view.component.html',
  styleUrls: ['./report-grid-view.component.css']
})
export class ReportGridViewComponent implements OnInit {

  public gridOptions: GridOptions = {
    debug: true,
    suppressCellSelection: true,
    rowSelection: 'multiple',      // Possible values are 'single' and 'multiple'
    domLayout: 'normal'
  };

  public defaultColDefs: any = {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: true,    // Causes the filter row to appear below column names
    autoHeight: true
  };

  public columnDefs = [
    {
      field: 'id',
      cellClass: 'grid-text-cell-format',
      cellRenderer: 'actionCellRenderer',
      cellRendererParams: {
        deleteButtonGridMethod: (params: ICellRendererParams) => this.openDeleteDialog(params),
        editButtonGridMethod: (params: ICellRendererParams) => this.openEditDialog(params)
      },

      headerName: '',
      filter: false,
      suppressMenu: true,
      sortable: false,
      checkboxSelection: true
    },
    {
      field: 'name',
      cellClass: 'grid-text-cell-format'
    },
    {
      field: 'priority',
      cellRenderer: 'priorityCellRenderer',
    },
    {
      field: 'start_date',
      cellClass: 'grid-text-cell-format'
    },
    {
      field: 'end_date',
      cellClass: 'grid-text-cell-format'
    }
  ];

  // Tell ag-grid which cell-renderers will be available
  // This is a map of component names that correspond to components that implement ICellRendererAngularComp
  public frameworkComponents: any = {
    priorityCellRenderer: PriorityCellCustomRendererComponent,
    actionCellRenderer: ReportGridActionCellRendererComponent
  };

  public  rowData: ReportRowDataDTO[];
  private gridApi: GridApi;
  private gridColumnApi: ColumnApi;
  public  totalRowsSelected: number;
  public  updateButtonLabel: string;
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

      this.generateDerivedValuesOnUserSelection()

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


  public openDeleteDialog(params: ICellRendererParams): void {
    console.log('openDeleteDialog()  params=', params);
  }

  public openEditDialog(params: ICellRendererParams): void {
    console.log('openEditDialog() params=', params);
  }


  public generateDerivedValuesOnUserSelection(): void {
    // Get the total number of rows that are selected
    this.totalRowsSelected = this.gridApi.getSelectedRows().length;

    if (this.totalRowsSelected == 0) {
      this.updateButtonLabel = "Update Entries";
    }
    else if (this.totalRowsSelected == 1) {
      // User has checked one entry
      this.updateButtonLabel = "Update 1 Entry";
    }
    else {
      // User has checked multiple entries
      this.updateButtonLabel = "Update " + this.totalRowsSelected + " Entries";
    }

  }

}
