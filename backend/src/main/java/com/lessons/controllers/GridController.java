package com.lessons.controllers;

import com.lessons.models.grid.GridGetRowsRequestDTO;
import com.lessons.models.grid.GridGetRowsResponseDTO;
import com.lessons.services.GridService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;

@Controller("com.lessons.controllers.GridController")
public class GridController {
    private static final Logger logger = LoggerFactory.getLogger(GridController.class);

    @Resource
    private GridService gridService;


    /**
     * The AG-Grid calls this REST endpoint to load the grid in server-side mode
     *
     * @param aAddReportDTO
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/api/grid/getRows", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<?> getRows(@RequestBody GridGetRowsRequestDTO aGridRequestDTO) throws Exception {
        logger.debug("getRows() started.");

        // Adding a report record to the system
        // reportService.addReport(aAddReportDTO);

        GridGetRowsResponseDTO responseDTO = gridService.getRows(aGridRequestDTO);

        // Return the responseDTO object and a 200 status code
        return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(responseDTO);
    }



}
