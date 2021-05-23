/*
 * This DTO holds information passed-in to the /api/search/autocomplete REST call
 */
export class AutoCompleteDTO {
  index_name:     string;
  returned_field: string;
  searched_field: string;
  raw_query:      string;
  size:           number;
}
