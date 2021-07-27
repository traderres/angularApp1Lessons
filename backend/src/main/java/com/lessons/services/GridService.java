package com.lessons.services;

import com.lessons.models.grid.*;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;
import java.util.List;
import java.util.Map;


@Service("com.lessons.services.GridService")
public class GridService {
    private static final Logger logger = LoggerFactory.getLogger(GridService.class);

    @Resource
    private ElasticSearchService elasticSearchService;


    /**
     *  1. Run a search
     *  2. Put the results into a list
     *  3. Create a GridGetRowsResponseDTO object
     *  4. Return the GridGetRowsResponseDTO object
     *
     * @param aGridRequestDTO holds information about the request
     * @return holds the response object (that holds the list of data, p
     */
    public GridGetRowsResponseDTO getPageOfData(String aIndexName, GridGetRowsRequestDTO aGridRequestDTO) throws Exception {

        logger.debug("getPageOfData()  startRow={}   endRow={}", aGridRequestDTO.getStartRow(), aGridRequestDTO.getEndRow() );

        int pageSize = aGridRequestDTO.getEndRow() - aGridRequestDTO.getStartRow();

        String esSearchAfterClause = "";

        if (aGridRequestDTO.getStartRow() > 0) {
            // Getting the 2nd, 3rd, 4th page....
            esSearchAfterClause = " \"search_after\": [" + aGridRequestDTO.getLastRowInfo() + "],";
        }

        // Construct the sort clause
        String esSortClauseWithComma = generateSortClauseFromSortParams(aGridRequestDTO.getSortModel() );

        // Construct the filter clause (if any)
        String filterClauseW = generateFilterClause(aGridRequestDTO.getFilterModel() );

        // Construct the query string

        String jsonQuery;

        if (StringUtils.isNotEmpty(filterClauseW)) {
            // This ES query has a filter
            jsonQuery = "{\n" +
                            esSearchAfterClause + "\n" +
                            esSortClauseWithComma + "\n" +
                           "   \"track_total_hits\": true,\n" +
                           "   \"size\": " + pageSize +",\n" +
                            "  \"query\": {\n" +
                            "    \"bool\": {\n" +
                            "      \"must\": {\n" +
                            "        \"match_all\": {}\n" +
                            "      },\n" +
                                    filterClauseW +
                            "    }\n" +
                            "  }\n" +
                            "}";
        }
        else {
            // This ES query does *NOT* have a filter
            jsonQuery = "{" +
                                esSearchAfterClause + "\n" +
                                esSortClauseWithComma + "\n" +
                            "       \"track_total_hits\": true,\n" +
                            "       \"size\": " + pageSize +",\n" +
                            "       \"query\": {\n" +
                            "           \"match_all\": {}\n" +
                            "       }\n" +
                            "}";
        }


        // Construct an ElasticSearch query


        // Make an outgoing ES aggregate call
        // -- This sets responseDTO.setData() and responseDTo.setTotalMatches()
        GridGetRowsResponseDTO responseDTO  = this.elasticSearchService.runSearchGetRowsResponseDTO(aIndexName, jsonQuery);

        // Set the lastRowInfo
        String lastRowInfo = generateLastRowInfoFromData(aGridRequestDTO.getSortModel(), responseDTO.getData());
        responseDTO.setLastRowInfo( lastRowInfo);

        // Set the lastRow  (so the ag-grid's infinite scrolling works correctly)
        if (aGridRequestDTO.getEndRow() < responseDTO.getTotalMatches() ) {
            // This is not the last page.  So, set lastRow=-1  (which turns on infinite scrolling)
            responseDTO.setLastRow(-1);
        }
        else {
            // This is the last page.  So, set lastRow=totalMatches (which turns off infinite scrolling)
            responseDTO.setLastRow( responseDTO.getTotalMatches() );
        }

        return responseDTO;
    }

    /**
     * Generate an ElasticSearch Filter clause
     *
     *       "filter": [
     *         {
     *           "term" : {
     *             "id":254
     *           }
     *         },
     *         {
     *           "term" : {
     *             "cityId":35
     *           }
     *         }
     *       ],
     *
     * @param aFilterModelsMap
     * @return
     */
    private String generateFilterClause(Map<String, ColumnFilter> aFilterModelsMap) {
        if ((aFilterModelsMap == null) || (aFilterModelsMap.size() == 0)){
            // There are no filters
            return null;
        }

        // Start off the filter ES query
        StringBuilder sbFilterClause = new StringBuilder("\"filter\": [");

        for (Map.Entry<String, ColumnFilter> filter: aFilterModelsMap.entrySet() ) {
            String originalFieldName = filter.getKey();
            String actualFilterFieldName;

            // Get the columnFilter object -- it may be a NumericColumnFilter or a TextColumnFilter
            ColumnFilter columnFilter = filter.getValue();

            if (columnFilter instanceof NumberColumnFilter) {
                // This is a numeric filter.

                // The actual ES field to search will have .filtered on it
                actualFilterFieldName = originalFieldName + ".filtered";

                NumberColumnFilter numberColumnFilter = (NumberColumnFilter) filter.getValue();
                Integer filterValue = numberColumnFilter.getFilter();

                // Add the filter to the ES query
                sbFilterClause.append("{" +
                        "                \"term\" : {\n" +
                        "                  \"" + actualFilterFieldName + "\":\"" + filterValue +"\"\n" +
                        "                }\n" +
                        "              },");
            }
            else if (columnFilter instanceof TextColumnFilter) {
                // This is a text filter

                // TODO: Get the correct fieldname by examining ElasticSearch at startup

                // The actual ES field to search will have .filtered on it
                actualFilterFieldName = originalFieldName + ".filtered";

                TextColumnFilter textColumnFilter = (TextColumnFilter) filter.getValue();
                String filterValue = textColumnFilter.getFilter();

                // Add the filter to the ES query
                // NOTE: Set the filterValue to lowercase (as the filtered collumn is stored as lowercase)
                sbFilterClause.append("{" +
                        "                \"term\" : {\n" +
                        "                  \"" + actualFilterFieldName + "\":\"" + filterValue.toLowerCase() +"\"\n" +
                        "                }\n" +
                        "              },");
            }
            else {
                throw new RuntimeException("Error in generateFilterClause():  Unknown filter Type.");
            }

        }  // End of looping through filters

        // Remove the last comma
        sbFilterClause.deleteCharAt(sbFilterClause.length() - 1);

        // Add the closing square bracket
        sbFilterClause.append("]\n");

        return sbFilterClause.toString();
    }


    private String generateLastRowInfoFromData(List<SortModel> aSortModels, List<Map<String, Object>> aData) {
        if (CollectionUtils.isEmpty(aData)) {
            return "";
        }
        else if (CollectionUtils.isEmpty(aSortModels)) {
            return "";
        }

        // Get the last map
        Map<String, Object> lastMap = aData.get( aData.size() - 1);

        StringBuilder sbLastRowInfo = new StringBuilder();

        for (SortModel sortModel: aSortModels) {
            String fieldName = sortModel.getColId();
            Object fieldValue = lastMap.get(fieldName);

            sbLastRowInfo.append(String.valueOf(fieldValue))
                         .append(",");
        }

        // Remove the last comma
        sbLastRowInfo.deleteCharAt(sbLastRowInfo.length() - 1);

        return sbLastRowInfo.toString();
    }




    private String generateSortClauseFromSortParams(List<SortModel> aSortModelList) {

        StringBuilder sbSortClause = new StringBuilder("\"sort\": [\n");

        // Loop through the list of sort models, generating the ES sort clause
        for (SortModel sortModel: aSortModelList) {
            String sortFieldName = sortModel.getColId();
            String sortOrder = sortModel.getSort();

            sbSortClause.append(
                    "{\n" +
                    "\"" + sortFieldName + "\": {\n" +
                    "            \"order\": \"" + sortOrder + "\",\n" +
                    "            \"missing\" : \"_first\"\n" +
                    "          }\n" +
                    "        },");
        }

        // Remove the last comma
        sbSortClause.deleteCharAt(sbSortClause.length() - 1);

        // Add the closing square bracket and comma to the end
        sbSortClause.append("],\n");

        return sbSortClause.toString();
    }
}
