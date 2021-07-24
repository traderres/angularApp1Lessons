package com.lessons.services;

import com.lessons.models.grid.GridGetRowsRequestDTO;
import com.lessons.models.grid.GridGetRowsResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;


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

        // Construct an ElasticSearch query
        String jsonQuery =
                        "{" +
                        "       \"query\": {\n" +
                        "           \"match_all\": {}\n" +
                        "       },\n" +
                        "       \"size\": 20,\n" +
                        "       \"sort\": [\n" +
                        "        {\n" +
                        "          \"id\": {\n" +
                        "            \"order\": \"asc\",\n" +
                        "            \"missing\" : \"_first\"\n" +
                        "          }\n" +
                        "        }\n" +
                        "      ]" +
                        "}";

        // Make an outgoing ES aggregate call
        GridGetRowsResponseDTO responseDTO  = this.elasticSearchService.runSearchGetRowsResponseDTO(aIndexName, jsonQuery);
        return responseDTO;
    }
}
