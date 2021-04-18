package com.lessons.controllers;

import com.lessons.models.AddReportDTO;
import com.lessons.models.GetReportDTO;
import com.lessons.services.ReportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;
import java.util.List;

@Controller("com.lessons.controllers.ReportController")
public class ReportController {
    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);

    @Resource
    private ReportService reportService;

    /*************************************************************************
     * POST /api/reports/add
     * Add a Report record to the system
     * @return nothing
     *************************************************************************/
    @RequestMapping(value = "/api/reports/add", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<?> addReport(@RequestBody AddReportDTO aAddReportDTO) throws Exception {
        logger.debug("addReport() started.");

        // Adding a report record to the system
        reportService.addReport(aAddReportDTO);

        // Return a response code of 200
        return ResponseEntity.status(HttpStatus.OK).body("");
    }

    /**
     * GET /api/reports/all
     *
     * @return JSON holding a list of report objects and a 200 status code
     */
    @RequestMapping(value = "/api/reports/all", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<?> getAllReports()  {
        logger.debug("getAllReports() started.");

        // Adding a report record to the system
        List<GetReportDTO> listOfReports = reportService.getAllReports();

        // Return the list of report objects back to the front-end
        // NOTE:  Jackson will convert the list of java objects to JSON for us
        return ResponseEntity.status(HttpStatus.OK).body(listOfReports);
    }
}
