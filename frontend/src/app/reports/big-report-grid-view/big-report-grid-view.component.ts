import {Component, OnDestroy, OnInit} from '@angular/core';
import {ColumnApi, GridApi, GridOptions, ServerSideStoreType} from "ag-grid-community";
import {PriorityCellCustomRendererComponent} from "../report-grid-view/priority-cell-custom-renderer/priority-cell-custom-renderer.component";
import {ReportGridActionCellRendererComponent} from "../report-grid-view/report-grid-action-cell-renderer/report-grid-action-cell-renderer.component";
import {Subscription} from "rxjs";
import {ThemeOptionDTO} from "../../models/ThemeOptionDTO";
import {ThemeService} from "../../services/theme.service";
import {GridService} from "../../services/grid.service";
import {MatDialog} from "@angular/material/dialog";
import {GridGetRowsResponseDTO} from "../../models/grid-get-rows-response-dto";
import {
  IServerSideDatasource,
  IServerSideGetRowsParams
} from "ag-grid-community/dist/lib/interfaces/iServerSideDatasource";
import {BigReportRowDataDTO} from "../../models/big-report-row-data-dto";

@Component({
  selector: 'app-big-report-grid-view',
  templateUrl: './big-report-grid-view.component.html',
  styleUrls: ['./big-report-grid-view.component.css']
})
export class BigReportGridViewComponent implements OnInit, OnDestroy {

  private isInitialCellFocusComplete: boolean = false;

  public gridOptions: GridOptions = {
    debug: false,
    suppressCellSelection: true,
    rowSelection: 'multiple',      // Possible values are 'single' and 'multiple'
    domLayout: 'normal',
    rowModelType: 'serverSide',    // Possible valures are 'clientSide', 'infinite', 'viewport', and 'serverSide'
    pagination: false,             // Do not show the 1 of 20 of 20, page 1 of 1

    serverSideStoreType:  ServerSideStoreType.Partial,
    cacheBlockSize: 20
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
      checkboxSelection: true
    },
    {
      field: 'display_name',
      cellClass: 'grid-text-cell-format'
    },
    {
      field: 'priority',
      cellRenderer: 'priorityCellRenderer',
    },
    {
      field: 'description',
      cellClass: 'grid-text-cell-format'
    }
  ];

  // Tell ag-grid which cell-renderers will be available
  // This is a map of component names that correspond to components that implement ICellRendererAngularComp
  public frameworkComponents: any = {
    priorityCellRenderer: PriorityCellCustomRendererComponent,
    actionCellRenderer: ReportGridActionCellRendererComponent
  };

  public  rowData: BigReportRowDataDTO[];
  private gridApi: GridApi;
  private gridColumnApi: ColumnApi;
  public  totalRowsSelected: number;
  public  updateButtonLabel: string;

  private themeStateSubscription: Subscription;
  public  currentTheme: ThemeOptionDTO;

  constructor(private themeService: ThemeService,
              private matDialog: MatDialog,
              private gridService: GridService) {}


  public ngOnInit(): void {
    // Listen for changes from the theme service
    this.themeStateSubscription = this.themeService.getThemeStateAsObservable().subscribe( (aNewTheme: ThemeOptionDTO) => {
      // The theme has changed.
      this.currentTheme = aNewTheme;
    });
  }


  public ngOnDestroy(): void {
    if (this.themeStateSubscription) {
      this.themeStateSubscription.unsubscribe();
    }
  }


  public onGridReady(params: any): void {
    // Get a reference to the gridApi and gridColumnApi (which we will need later to get selected rows)
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // Create a server-side data source object
    let serverSideDataSource: IServerSideDatasource = {
      getRows: (params: IServerSideGetRowsParams) => {
        // The grid needs to load data.  So, invoke our gridService.getServerSideData() and load the data

        // By default the grid will sohw a "Loading..." mesage while it's waiting for data

        // Subscribe to this service method to get the data
        this.gridService.getServerSideData(params.request)
          .subscribe((response: GridGetRowsResponseDTO) => {
            // REST Call finished successfully

            // Load the data
            params.successCallback(response.data, response.lastRow)

            if ( (!this.isInitialCellFocusComplete) && response.data.length > 0) {
              // This is the initial page load.
              this.isInitialCellFocusComplete = true;

              // Set the focus on cell 1, row 1 so that the page-up/page-down buttons on the keyboard are picked-up
              this.gridApi.setFocusedCell(1, "id");
            }

          });

      }
    };

    // Set the server-side data source
    // NOTE:  The grid will asynchronously call getRows() as it needs to load data
    this.gridApi.setServerSideDatasource(serverSideDataSource);
  }


  private reloadPage(): void {
    console.log('reloadPage()');

    // // Show the loading overlay
    // this.gridApi.showLoadingOverlay();
    //
    // // Invoke a REST call to get data for the initial page load
    // this.gridService.getReportData().subscribe((aData: BigReportRowDataDTO[]) => {
    //   // We got data from the REST call
    //
    //   // Put the data into the grid
    //   this.rowData = aData;
    //
    //   // Unselect all values
    //   this.gridApi.deselectAll();
    //
    //   // Regenerate derived values
    //   this.generateDerivedValuesOnUserSelection()
    //
    //   // Resize the columns
    //   this.gridApi.sizeColumnsToFit();
    //
    //   // Reset row heights
    //   this.gridApi.resetRowHeights();
    //
    //   // Tell the grid to resize when user resizes the browser window
    //   window.onresize = () => {
    //     this.gridApi.sizeColumnsToFit();
    //   }
    //
    // });

  }  // end of reloadPage()




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
  //
  // public openUpdatePriorityPopup(): void {
  //   console.log('openUpdatePriorityPopup');
  //
  //   // Create an empty array of numbers
  //   let selectedReportIds: number[] = [];
  //
  //   // Loop through the array of selected rows and add the selected ids to the list
  //   this.gridApi.getSelectedRows().forEach((row: BigReportRowDataDTO) => {
  //     selectedReportIds.push(row.id);
  //   });
  //
  //   let formData: UpdatePriorityDialogFormData = new UpdatePriorityDialogFormData();
  //   formData.reportIds = selectedReportIds;
  //
  //   // Open the dialog box in modal mode
  //   let dialogRef = this.matDialog.open(UpdatePriorityDialogComponent, {
  //     data: formData
  //     // minWidth: 400,
  //     // minHeight: 200
  //   });
  //
  //   // Listen for the dialog box to close
  //   dialogRef.afterClosed().subscribe((returnedFormData: UpdatePriorityDialogFormData) => {
  //     // The dialog box has closed
  //
  //     if (returnedFormData) {
  //       // The user pressed OK.  So, update the data
  //
  //       // TODO: Invoke the REST call
  //
  //       // Reload the list
  //       this.reloadPage();
  //     }
  //   });
  //
  // }   // end of openUpdatePriorityPopup()



}
