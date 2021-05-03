package com.lessons.controllers;

import com.lessons.models.*;
import com.lessons.services.AsyncService;
import com.lessons.services.ElasticSearchService;
import com.lessons.services.JobService;
import com.lessons.services.ReportService;
import com.lessons.workers.FileWorker;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.util.List;

@Controller("com.lessons.controllers.ReportController")
public class ReportController {
    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);

    @Resource
    private ElasticSearchService elasticSearchService;

    @Resource
    private ReportService reportService;

    @Resource
    private JobService jobService;

    @Resource
    private AsyncService asyncService;

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



    /**
     * REST endpoint /api/reports/upload
     * @param aMultipartFile holds uploaded file InputStream and meta data
     * @return the jobId and a 200 status code
     */
    @RequestMapping(value = "/api/reports/upload", method = RequestMethod.POST)
    public ResponseEntity<?> uploadFile(
            @RequestParam(value = "file", required = true) MultipartFile aMultipartFile) throws Exception
    {
        logger.debug("uploadFile() started. ");

        String loggedInUserName = "John Smith";
        String uploadedFilename = aMultipartFile.getOriginalFilename();

        // Add a record to the jobs table
        Integer jobId = jobService.addJobRecord(loggedInUserName, uploadedFilename);

        // Create the worker thread that will process this NISS file (xlsx file)
        FileWorker fileWorker = new FileWorker(jobId, aMultipartFile.getInputStream(), this.jobService);

        // Execute the worker thread in the background
        // NOTE:  This code runs in a separate thread
        asyncService.submit(fileWorker);

        // Return a response of 200 and the job number
        return ResponseEntity.status(HttpStatus.OK)
                             .body(jobId);
    }


    /**
     * REST endpoint /api/mapping/create
     *
     * This REST endpoint will create the ES mapping
     * @return ResponseEntity object that holds a 200 status code and a basic string message
     * @throws Exception if something bad happens
     */
    @RequestMapping(value = "/api/mapping/create", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<?> createMapping() throws Exception {

        logger.debug("createMapping() started.");

        // Read the mapping file into a large string
        String reportsMappingAsJson =
                elasticSearchService.readInternalFileIntoString("reports.mapping.json");

        // Create a mapping in ElasticSearch
        elasticSearchService.createIndex("reports" , reportsMappingAsJson);

        // Return a simple message back to the front-end as a string
        return ResponseEntity
                .status(HttpStatus.OK)
                .contentType(MediaType.TEXT_PLAIN)
                .body("Successfully Created the mapping reports");
    }


    /**
     * REST endpoint /api/mapping/add
     *
     * @return ResponseEntity object that holds a 200 status code and a basic string message
     * @throws Exception if something bad happens
     */
    @RequestMapping(value = "/api/mapping/add", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<?> addRecords() throws Exception {

        logger.debug("addRecords() started.");

        // Construct the JSON for a bulk update
        // NOTE:  You must have the \n at the end of each data line (including the last one)
        String jsonBulkInsert = "" +
                "{ \"index\": { \"_index\": \"reports\" }}\n" +
                "{ \"priority\": \"low\", \"description\": \"he really likes o'reilly\"}\n" +
                "{ \"index\": { \"_index\": \"reports\"  }}\n" +
                "{ \"priority\": \"LOW\",  \"description\": \"depending on the kind query, you might want to go different ways with it\"}\n";


        // Add 2 records to the Reports mapping and *wait* for ES to refresh
        elasticSearchService.bulkUpdate(jsonBulkInsert, true);

        // Return a simple message back to the front-end
        return ResponseEntity
                .status(HttpStatus.OK)
                .contentType(MediaType.TEXT_PLAIN)
                .body("Successfully added some records.  Here is what was added:  " + jsonBulkInsert);
    }


}
