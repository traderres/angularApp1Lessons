package com.lessons.services;

import com.lessons.models.grid.GridGetRowsRequestDTO;
import com.lessons.models.grid.GridGetRowsResponseDTO;
import com.lessons.models.grid.SortModel;
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
        String esSortClause = generateSortClauseFromSortParams(aGridRequestDTO.getSortModel() );

        // Construct an ElasticSearch query
        String jsonQuery =
                        "{" +
                        "       \"query\": {\n" +
                        "           \"match_all\": {}\n" +
                        "       },\n" +
                        "       \"size\": " + pageSize +",\n" +
                                esSearchAfterClause + "\n" +
                                esSortClause + "\n" +
                        "      ]" +
                        "}";

        // Make an outgoing ES aggregate call
        GridGetRowsResponseDTO responseDTO  = this.elasticSearchService.runSearchGetRowsResponseDTO(aIndexName, jsonQuery);

        // Set the last row info
        String lastRowInfo = generateLastRowInfoFromData(aGridRequestDTO.getSortModel(), responseDTO.getData());
        responseDTO.setLastRowInfo( lastRowInfo);

        return responseDTO;
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
            Object fieldValue = (Object) lastMap.get(fieldName);

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
        return sbSortClause.toString();
    }
}
