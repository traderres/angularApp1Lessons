import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
export class BigReportGridViewComponent implements OnInit, OnDestroy, AfterViewInit {

  private lastRowInfo: string | null;
  public  totalMatches: number = 0;

  public  rawSearchQuery: string = "";

  public gridOptions: GridOptions = {
    debug: true,
    suppressCellSelection: true,
    rowSelection: 'multiple',      // Possible values are 'single' and 'multiple'
    domLayout: 'normal',
    rowModelType: 'serverSide',    // Possible valures are 'clientSide', 'infinite', 'viewport', and 'serverSide'
    pagination: false,             // Do not show the 1 of 20 of 20, page 1 of 1 (as we are doing infinite scrolling)

    serverSideStoreType: ServerSideStoreType.Partial,   // Use partial Server Side Store Type so that pages of data are loaded
    cacheBlockSize: 50,                                 // Load 50 records at a time with each REST call
    blockLoadDebounceMillis: 100,
    debounceVerticalScrollbar: true,

    onFilterChanged: () => {
      this.clearGridCache();
    },

    onSortChanged: () => {
      this.clearGridCache();
    }
  }

  private clearGridCache(): void {
    // Move the scrollbar to the top
    this.gridApi.ensureIndexVisible(0, 'top');

    // Clear the cache
    this.gridApi?.setServerSideDatasource(this.serverSideDataSource);
  }


  public clearFilterAndSorting(): void {
    // Clear the grid cache and move the vertical scrollbar to the top
    this.clearGridCache();

    this.gridApi.setFilterModel(null);
    this.gridApi.setSortModel(null);

    this.rawSearchQuery = "";

    // Call onFilterChanged so that the grid starts over
    this.gridApi.onFilterChanged();
  }


  public runSearch(): void {
    this.clearGridCache();

    this.gridApi.setFilterModel(null);
    this.gridApi.setSortModel(null);

    // Call onFilterChanged so that the grid starts over
    this.gridApi.onFilterChanged();
  }


  // Create a server-side data source object
  private serverSideDataSource: IServerSideDatasource = {
    getRows: (params: IServerSideGetRowsParams) => {
      // The grid needs to load data.  So, subscribe to gridService.getServerSideData() and load the data

      if (params.request.startRow == 0) {
        // The user is requesting a first page (so we are not getting a 2nd or 3rd page)
        // -- Reset the additional sort fields  (needed for the 2nd, 3rd, 4th pages)
        this.lastRowInfo = null;
      }

      // Add the additional sort fields to the request object
      let getRowsRequestDTO: GridGetRowsRequestDTO = new GridGetRowsRequestDTO(params.request, this.lastRowInfo, this.rawSearchQuery)

      // Subscribe to this service method to get the data
      this.gridService.getServerSideData(getRowsRequestDTO)
        .subscribe((response: GridGetRowsResponseDTO) => {
          // REST Call finished successfully

          // Save the additional sort fields  (we will use when getting the next page)
          this.lastRowInfo = response.lastRowInfo;

          // Update total matches on the screen
          this.totalMatches = response.totalMatches;

          // Load the data into the grid and turn on/off infinite scrolling
          // If lastRow == -1,           then Infinite-Scrolling is turned ON
          // if lastRow == totalMatches, then infinite-scrolling is turned OFF
          params.successCallback(response.data, response.lastRow)
        });

    }
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
      filter: 'agNumberColumnFilter',           // numeric filter
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
      sortable: false,                      // The description field is not sortable
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

  @ViewChild('searchBox',  { read: ElementRef }) searchBox: ElementRef;

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


  public ngAfterViewInit(): void {
    // Set the focus on the search box
    setTimeout(() => this.searchBox.nativeElement.focus(), 10);
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


    // Set the server-side data source
    // NOTE:  The grid will asynchronously call getRows() as it needs to load data
    this.gridApi.setServerSideDatasource(this.serverSideDataSource);
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
