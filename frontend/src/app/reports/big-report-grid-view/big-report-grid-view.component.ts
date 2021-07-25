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
import {GridGetRowsRequestDTO} from "../../models/grid-get-rows-request-dto";

@Component({
  selector: 'app-big-report-grid-view',
  templateUrl: './big-report-grid-view.component.html',
  styleUrls: ['./big-report-grid-view.component.css']
})
export class BigReportGridViewComponent implements OnInit, OnDestroy {

  private isInitialCellFocusComplete: boolean = false;
  private lastRowInfo: string | null;
  public  totalMatches: number = 0;

  public gridOptions: GridOptions = {
    debug: true,
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


  private textFilterParams = {
    filterOptions: ['contains', 'notContains'],
    caseSensitive: false,
    debounceMs: 200,
    suppressAndOrCondition: true,
  };

  public columnDefs = [
    {
      field: 'id',
      filter: 'agTextColumnFilter',
      filterParams: this.textFilterParams,
      cellClass: 'grid-text-cell-format',
      checkboxSelection: true
    },
    {
      field: 'display_name',
      filter: 'agTextColumnFilter',
      filterParams: this.textFilterParams,
      cellClass: 'grid-text-cell-format'
    },
    {
      field: 'priority',
      filter: 'agTextColumnFilter',
      filterParams: this.textFilterParams,
      cellRenderer: 'priorityCellRenderer',
    },
    {
      field: 'description',
      filter: 'agTextColumnFilter',
      filterParams: this.textFilterParams,
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

        if (params.request.startRow == 0) {
          // The user is requesting a first page (so we are not getting a 2nd or 3rd page)
          // -- Reset the additional sort fields  (needed for the 2nd, 3rd, 4th pages)
          this.lastRowInfo = null;
        }

        // Add the additional sort fields to the request object
        let getRowsRequestDTO: GridGetRowsRequestDTO = new GridGetRowsRequestDTO(params.request, this.lastRowInfo)

        // Subscribe to this service method to get the data
        this.gridService.getServerSideData(getRowsRequestDTO)
          .subscribe((response: GridGetRowsResponseDTO) => {
            // REST Call finished successfully

            // Save the additional sort fields  (we will use when getting the next page)
            this.lastRowInfo = response.lastRowInfo;

            // Update total matches on the screen
            this.totalMatches = response.lastRow;

            // Load the data into the grid
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


  public  reloadPage(): void {

    this.gridApi.refreshServerSideStore({
      route: [],    // List of group keys, pointing to the store to refresh
      purge: true   // if purge==true,  then "Loading" spinner appears,   all rows are destroyed, and one page of data is loaded.  Also, the loading image appears
                    // if purge==false, then No "Loading" spinner appears, all rows are destroyed and N pages are re-loaded (if there are 5 pages, then 5 REST calls are invoked)
    });

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
