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
    public GridGetRowsResponseDTO getRows(GridGetRowsRequestDTO aGridRequestDTO) {


        GridGetRowsResponseDTO responseDTO = new GridGetRowsResponseDTO();
        return responseDTO;
    }
}
