export class GridGetRowsResponseDTO {
  public data: any[];
  public lastRow: number;
  public secondaryColumnFields: string[];

  public lastRowInfo: string;      // Holds information about the last row so ElasticSearch can get page2, page3, ...
}
