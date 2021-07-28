package com.lessons.controllers;

import com.lessons.models.grid.GridGetRowsRequestDTO;
import com.lessons.models.grid.GridGetRowsResponseDTO;
import com.lessons.models.grid.SortModel;
import com.lessons.services.GridService;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Controller("com.lessons.controllers.GridController")
public class GridController {
    private static final Logger logger = LoggerFactory.getLogger(GridController.class);

    @Resource
    private GridService gridService;


    /**
     * The AG-Grid calls this REST endpoint to load the grid in server-side mode
     *
     * @param aGridRequestDTO holds the Request information
     * @return ResponseEntity that holds a GridGetRowsResponseDTO object
     * @throws Exception if something bad happens
     */
    @RequestMapping(value = "/api/grid/getRows", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<?> getRows(@RequestBody GridGetRowsRequestDTO aGridRequestDTO) throws Exception {
        logger.debug("getRows() started.");

        // Change the sort field from "priority" to "priority.sort"  (so the sort is case insensitive -- see the mapping)
        if (CollectionUtils.isNotEmpty(aGridRequestDTO.getSortModel())) {
            for (SortModel sortModel: aGridRequestDTO.getSortModel() ) {
                String sortFieldName = sortModel.getColId();
                if (! sortFieldName.equalsIgnoreCase("id")) {
                    sortFieldName = sortFieldName + ".sort";
                    sortModel.setColId(sortFieldName);
                }
            }
        }


        if (CollectionUtils.isEmpty( aGridRequestDTO.getSortModel() )) {
            // The passed-in sort models is empty
            // -- If there is a search query, then sort by score descending
            // -- If no search query, then sort by id ascending
            SortModel defaultSortModel;
            if ( StringUtils.isNotBlank(aGridRequestDTO.getRawSearchQuery() )) {
                // The user entered a search query.  So, sort by score descending
                defaultSortModel = new SortModel("_score", "desc");
            }
            else {
                // The user did not enter a search query.  So, sort by the id ascending
                defaultSortModel = new SortModel("id", "asc");
            }

            List<SortModel> sortModelList = Collections.singletonList(defaultSortModel);
            aGridRequestDTO.setSortModel(sortModelList);
        }


        // Use the grid service to get some matches and return an object that has the matches and meta-data about the matches
        List<String> reportFieldsToSearch = Arrays.asList("id.sort", "description", "display_name.sort", "priority.sort");

        GridGetRowsResponseDTO responseDTO = gridService.getPageOfData("reports", reportFieldsToSearch, aGridRequestDTO);

        // Return the responseDTO object and a 200 status code
        return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(responseDTO);
    }



}
