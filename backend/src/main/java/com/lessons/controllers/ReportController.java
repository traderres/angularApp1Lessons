package com.lessons.controllers;

import com.lessons.models.AddReportDTO;
import com.lessons.models.GetReportDTO;
import com.lessons.models.GetUpdateReportDTO;
import com.lessons.models.SetUpdateReportDTO;
import com.lessons.services.ReportService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
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


    /**
     * POST /api/reports/update/set
     *
     * Update the Report record in the system
     *
     * @return 200 status code if the update worked
     */
    @RequestMapping(value = "/api/reports/update/set", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<?> updateReport(@RequestBody SetUpdateReportDTO aUpdateReportDTO)  {
        logger.debug("updateReport() started.");

        // Verify that required parameters were passed-in
        if (aUpdateReportDTO.getId() == null) {
            // The report ID was not passed-in
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("The report ID is null.  This is an invalid parameter.");
        }
        else if (StringUtils.isBlank(aUpdateReportDTO.getReportName() )) {
            // The report name is blank
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("The report name is blank.  This is an invalid parameter.");
        }
        else if (! reportService.doesReportIdExist(aUpdateReportDTO.getId() ) ) {
            // The report ID was not found in the system
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("The report ID was not found in the system.");
        }

        // Update the report record
        reportService.updateReport(aUpdateReportDTO);

        // Return only a 200 status code
        return ResponseEntity.status(HttpStatus.OK)
                             .contentType(MediaType.TEXT_PLAIN)
                             .body("");
    }


    /**
     * GET /api/reports/update/get/{reportId}
     *
     * @return JSON holding info about a single report to edit
     */
    @RequestMapping(value = "/api/reports/update/get/{reportId}", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<?> getInfoForEditReport(@PathVariable(name="reportId") Integer aReportId)  {
        logger.debug("getInfoForEditReport() started.");

        if (! reportService.doesReportIdExist(aReportId ) ) {
            // The report ID was not found in the system
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("The report ID was not found in the system.");
        }

        // Get information about this report (for the "Edit Report" page)
        GetUpdateReportDTO dto = this.reportService.getInfoForUpdateReport(aReportId);

        // Return the object back to the front-end
        // NOTE:  Jackson will convert the list of java objects to JSON for us
        return ResponseEntity.status(HttpStatus.OK).body(dto);
    }


}
