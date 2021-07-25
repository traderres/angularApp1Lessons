package com.lessons.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lessons.config.ElasticSearchResources;
import com.lessons.models.AutoCompleteDTO;
import com.lessons.models.AutoCompleteMatchDTO;
import com.lessons.models.ErrorsDTO;
import com.lessons.models.grid.GridGetRowsResponseDTO;
import com.ning.http.client.AsyncHttpClient;
import com.ning.http.client.Response;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service("com.lessons.services.ElasticSearchService")
public class ElasticSearchService {

    private static final Logger logger = LoggerFactory.getLogger(ElasticSearchService.class);

    @Resource
    private ElasticSearchResources elasticSearchResources;

    private String elasticSearchUrl;
    private AsyncHttpClient asyncHttpClient;
    private final int ES_REQUEST_TIMEOUT_IN_MILLISECS = 90000;

    private ObjectMapper objectMapper;

    @PostConstruct
    public void init() throws Exception {
        logger.debug("init() started.");

        // In order to make outgoing calls to ElasticSearch you need 2 things:
        //   1) The elastic search url -- e.g., "http://localhost:9201"
        //   2) The initialized AsyncHttpClient object
        this.elasticSearchUrl = elasticSearchResources.getElasticSearchUrl();
        this.asyncHttpClient = elasticSearchResources.getAsyncHttpClient();


        this.objectMapper = new ObjectMapper();

        // Create the reports mapping (if they do not exist)
        initializeMapping();

        logger.debug("init() finished.  elasticSearchUrl={}", this.elasticSearchUrl);
    }

    private void initializeMapping() throws Exception {
        if (! doesIndexExist("reports")) {
            // Create the reports ES mapping

            // Read the mapping file into a large string
            String reportsMappingAsJson = readInternalFileIntoString("reports.mapping.json");

            // Create a mapping in ElasticSearch
            createIndex("reports", reportsMappingAsJson);
        }
    }



    /**
     * Helper to read an entire file into a String -- handy for reading in JSON mapping files
     * @param aFilename holds the name of the file (found in /src/main/resources
     * @return the file's contents as a String
     * @throws Exception if there are problems reading from the file
     */
    public String readInternalFileIntoString(String aFilename) throws Exception {
        try (InputStream inputStream =  ElasticSearchService.class.getResourceAsStream("/" +
                aFilename)) {
            return StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
        }
    }

    /**
     * Create a new ES Index
     * @param aIndexName holds the name of the new index to create
     * @param aJsonMapping holds the mapping of this index
     * @throws Exception if something bad happens
     */
    public void createIndex(String aIndexName, String aJsonMapping) throws Exception {
        logger.debug("createIndex() started.  aIndexName={}", aIndexName);

        if (StringUtils.isEmpty(aIndexName)) {
            throw new RuntimeException("The passed-in aIndexName is null or empty.");
        }

        String url = this.elasticSearchUrl + "/" + aIndexName;
        logger.debug("Going to this url:  {}", url);

        // Make a synchronous POST call to ElasticSearch to create this an index
        Response response = this.asyncHttpClient.preparePut(url)
                .setRequestTimeout(this.ES_REQUEST_TIMEOUT_IN_MILLISECS)
                .setHeader("accept", "application/json")
                .setHeader("Content-Type", "application/json")
                .setBody(aJsonMapping)
                .execute()
                .get();

        if (response.getStatusCode() != 200) {
            // ElasticSearch returned a non-200 status response
            throw new RuntimeException("Error in createIndex:  ES returned a status code of " +
                    response.getStatusCode() + " with an error of: " + response.getResponseBody());
        }

        logger.info("Successfully created this ES index: {}", aIndexName);
    }

    /**
     * Do a bulk update within ES
     * @param aBulkUpdateJson Holds the JSON bulk string
     * @param aWaitForRefresh Holds TRUE if we will wait for a refresh
     * @throws Exception if something bad happens
     */
    public void bulkUpdate(String aBulkUpdateJson, boolean aWaitForRefresh) throws
            Exception {
        if (StringUtils.isEmpty(aBulkUpdateJson)) {
            throw new RuntimeException("The passed-in JSON is null or empty.");
        }

        String url = this.elasticSearchUrl + "/_bulk";
        if (aWaitForRefresh) {
            url = url + "?refresh=wait_for";
        }

        // Make a synchronous POST call to do a bulk-index request
        Response response = this.asyncHttpClient.preparePost(url)
                .setRequestTimeout(this.ES_REQUEST_TIMEOUT_IN_MILLISECS)
                .setHeader("accept", "application/json")
                .setHeader("Content-Type", "application/json")
                .setBody(aBulkUpdateJson)
                .execute()
                .get();

        if (response.getStatusCode() != 200) {
            // ElasticSearch returned a non-200 status response
            throw new RuntimeException("Error in bulkUpdate:  ES returned a status code of " + response.getStatusCode() + " with an error of: " + response.getResponseBody());
        }

        // Examine the JSON response to see if the errors="true" flag was set
        //  1. Convert the response JSON string into an errorsDto object
        //  2. Look at the errorsDTO object.isErrors() method
        //     NOTE:  This is substantially faster as the ErrorDTO tells Jackson to ignore the other fields
        String jsonResponse = response.getResponseBody();
        ErrorsDTO errorsDTO = objectMapper.readValue(jsonResponse, ErrorsDTO.class);

        if (errorsDTO.isErrors()) {
            // ElasticSearch returned a 200 response, but the bulk update failed
            logger.error("Error in bulkUpdate:  ES returned a status code of {} with an error of {}", response.getStatusCode(), response.getResponseBody());
            throw new RuntimeException("Error in bulkUpdate:  ES returned a status code of " + response.getStatusCode() + " with an error of: " + response.getResponseBody());
        }

    }

    /**
     * Delete the index from ElasticSearch
     * @param aIndexName  holds the index name (or alias name)
     */
    public void deleteIndex(String aIndexName) throws Exception {
        if (StringUtils.isEmpty(aIndexName)) {
            throw new RuntimeException("The passed-in aIndexName is null or empty.");
        }

        // Make a synchronous POST call to delete this ES Index
        Response response = this.asyncHttpClient.prepareDelete(this.elasticSearchUrl + "/" +
                aIndexName)
                .setRequestTimeout(this.ES_REQUEST_TIMEOUT_IN_MILLISECS)
                .setHeader("accept", "application/json")
                .setHeader("Content-Type", "application/json")
                .execute()
                .get();

        if (response.getStatusCode() != 200) {
            // ElasticSearch returned a non-200 status response
            throw new RuntimeException("Error in deleteIndex:  ES returned a status code of " +
                    response.getStatusCode() + " with an error of: " + response.getResponseBody());
        }
    }



    /**
     * Helper method to determine if the passed-in ES mapping name or alias exists
     * @param aIndexName holds the ES mapping name or alias
     * @return TRUE if the passed-in index or alias exists
     */
    public boolean doesIndexExist(String aIndexName) throws Exception {

        if (StringUtils.isEmpty(aIndexName)) {
            throw new RuntimeException("The passed-in aIndexName is null or empty.");
        }

        // Make a synchronous GET call to get a list of all index names
        Response response = this.asyncHttpClient.prepareGet(this.elasticSearchUrl + "/_cat/indices")
                .setRequestTimeout(this.ES_REQUEST_TIMEOUT_IN_MILLISECS)
                .setHeader("accept", "text/plain")
                .execute()
                .get();

        if (response.getStatusCode() != 200) {
            throw new RuntimeException("Critical error in doesIndexExist():  ElasticSearch returned a response status code of " +
                    response.getStatusCode() + ".  Response message is " + response.getResponseBody() );
        }

        // Loop through the lines of data -- looking for the passed-in index name
        String linesOfInfo = response.getResponseBody();
        if (StringUtils.isNotEmpty(linesOfInfo)) {
            String[] lines = linesOfInfo.split("\n");

            for (String line : lines) {
                String[] indexParts = line.split(" ");
                if (indexParts.length >= 3) {
                    String actualIndexName = indexParts[2];

                    if (actualIndexName.equalsIgnoreCase(aIndexName)) {
                        logger.debug("doesIndexExist() returns true for {}", aIndexName);
                        return true;
                    }
                }
            }
        }

        // The index name was not found in the system.  So, return false
        return false;

    }  // end of doesIndexExist()



    /**
     * @param aRawQuery holds the raw query text
     * @return an empty string (if the passed-in string is null
     */
    private String cleanupRawQuery(String aRawQuery) {
        String cleanedQuery = aRawQuery;

        if (cleanedQuery == null) {
            cleanedQuery = "";
        }

        return cleanedQuery;
    }


    /**
     * Run an auto-complete search
     * @param aAutoCompleteDTO   holds information about the index and what field to search
     * @return a list of matching AutoCompleteMatchDTO objects (or an empty list if no matches are found)
     * @throws Exception if something bad happens
     */
    public List<AutoCompleteMatchDTO> runAutoComplete(AutoCompleteDTO aAutoCompleteDTO) throws Exception {
        if (aAutoCompleteDTO == null) {
            throw new RuntimeException("Error in runAutoComplete():  The passed-in aAutoCompleteDTO is null.");
        }

        String cleanedQuery = cleanupRawQuery(aAutoCompleteDTO.getRawQuery());

        // Convert the cleaned query to lowercase (which is required as all ngrams are lowercase)
        cleanedQuery = cleanedQuery.toLowerCase();

        String jsonRequest =
                "{\n" +
                        "  \"_source\": [\"" + aAutoCompleteDTO.getReturnedField() + "\"]," +
                        "  \"query\": {\n" +
                        "    \"term\": {\n" +
                        "       \"" + aAutoCompleteDTO.getSearchedField() + "\": \"" + cleanedQuery + "\"\n" +
                        "     }\n" +
                        "  },\n" +
                        "  \"size\": " + aAutoCompleteDTO.getSize() +"\n" +
                        "}";

        // Make a synchronous POST call to run this ES search
        Response response = this.asyncHttpClient.preparePost(this.elasticSearchUrl + "/" + aAutoCompleteDTO.getIndexName() + "/_search")
                .setRequestTimeout(this.ES_REQUEST_TIMEOUT_IN_MILLISECS)
                .setHeader("accept", "application/json")
                .setHeader("Content-Type", "application/json")
                .setBody(jsonRequest)
                .execute()
                .get();

        if (response.getStatusCode() != 200) {
            // ElasticSearch returned a non-200 status response
            throw new RuntimeException("Error in runAutoComplete():  ES returned a status code of " + response.getStatusCode() + " with an error of: " + response.getResponseBody());
        }

        // Create an empty array list
        List<AutoCompleteMatchDTO> listOfAutoCompleteMatchDTOs = new ArrayList<>();

        // Pull the list of matching values from the JSON Response
        String jsonResponse = response.getResponseBody();

        // Convert the response JSON string into a map and examine it to see if the request really worked
        Map<String, Object> mapResponse = objectMapper.readValue(jsonResponse, new TypeReference<Map<String, Object>>() {});

        @SuppressWarnings("unchecked")
        Map<String, Object> outerHits = (Map<String, Object>) mapResponse.get("hits");
        if (outerHits == null) {
            throw new RuntimeException("Error in runAutoComplete():  The outer hits value was not found in the JSON response");
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> innerHits = (List<Map<String, Object>>) outerHits.get("hits");
        if (innerHits == null) {
            throw new RuntimeException("Error in runAutoComplete():  The inner hits value was not found in the JSON response");
        }

        if (innerHits.size() > 0) {
            for (Map<String, Object> hit: innerHits) {

                // Get the _id field from the hit map
                String id = (String) hit.get("_id");

                @SuppressWarnings("unchecked")
                Map<String, Object> sourceMap = (Map<String, Object>) hit.get("_source");
                if (sourceMap == null) {
                    throw new RuntimeException("Error in runAutoComplete():  The source map was null in the JSON response");
                }

                // Get the matching returned field
                String match = (String) sourceMap.get(aAutoCompleteDTO.getReturnedField());

                // Create an AutoCompleteMatchDTO object
                AutoCompleteMatchDTO matchDTO = new AutoCompleteMatchDTO(id, match);

                // Add the AutoCompleteMatchDTO object to the list
                // (so the front-end will have an id and name field for this match)
                listOfAutoCompleteMatchDTOs.add(matchDTO);
            }
        }


        // Return the list of matching strings
        return listOfAutoCompleteMatchDTOs;
    }



    public String runSearchGetJsonResponse(String aIndexName, String aJsonBody) throws Exception {
        if (StringUtils.isEmpty(aIndexName)) {
            throw new RuntimeException("The passed-in aIndexName is null or empty.");
        }

        // Make a synchronous POST call to execute a search and return the count
        Response response = this.asyncHttpClient.prepareGet(this.elasticSearchUrl + "/" + aIndexName + "/_search")
                .setRequestTimeout(this.ES_REQUEST_TIMEOUT_IN_MILLISECS)
                .setHeader("accept", "application/json")
                .setHeader("Content-Type", "application/json")
                .setBody(aJsonBody)
                .execute()
                .get();

        if (response.getStatusCode() != 200) {
            throw new RuntimeException("Critical error in runSearchGetJsonResponse():  ElasticSearch returned a response status code of " +
                    response.getStatusCode() + ".  Response message is " + response.getResponseBody() + "\n\n" + aJsonBody);
        }

        // Get the JSON response
        String jsonResponse = response.getResponseBody();
        return jsonResponse;
    }



    public GridGetRowsResponseDTO runSearchGetRowsResponseDTO(String aIndexName, String aJsonBody) throws Exception {
        if (StringUtils.isEmpty(aIndexName)) {
            throw new RuntimeException("The passed-in aIndexName is null or empty.");
        }
        else if (StringUtils.isEmpty(aJsonBody)) {
            throw new RuntimeException("The passed-in aJsonBody is null or empty.");
        }

        // Make a synchronous POST call to execute a search and return a response object
        Response response = this.asyncHttpClient.prepareGet(this.elasticSearchUrl + "/" + aIndexName + "/_search")
                .setRequestTimeout(this.ES_REQUEST_TIMEOUT_IN_MILLISECS)
                .setHeader("accept", "application/json")
                .setHeader("Content-Type", "application/json")
                .setBody(aJsonBody)
                .execute()
                .get();

        if (response.getStatusCode() != 200) {
            throw new RuntimeException("Critical error in runSearchGetJsonResponse():  ElasticSearch returned a response status code of " +
                    response.getStatusCode() + ".  Response message is " + response.getResponseBody() + "\n\n" + aJsonBody);
        }


        // Create an empty array list
        List<Map<String, Object>> listOfMaps = new ArrayList<>();

        // Pull the list of matching values from the JSON Response
        String jsonResponse = response.getResponseBody();

        // Convert the response JSON string into a map and examine it to see if the request really worked
        Map<String, Object> mapResponse = objectMapper.readValue(jsonResponse, new TypeReference<Map<String, Object>>() {});

        @SuppressWarnings("unchecked")
        Map<String, Object> outerHits = (Map<String, Object>) mapResponse.get("hits");
        if (outerHits == null) {
            throw new RuntimeException("Error in runAutoComplete():  The outer hits value was not found in the JSON response");
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> innerHits = (List<Map<String, Object>>) outerHits.get("hits");
        if (innerHits == null) {
            throw new RuntimeException("Error in runAutoComplete():  The inner hits value was not found in the JSON response");
        }

        if (innerHits.size() > 0) {
            for (Map<String, Object> hit: innerHits) {

                // Get the source map (that has all of the results)
                @SuppressWarnings("unchecked")
                Map<String, Object> sourceMap = (Map<String, Object>) hit.get("_source");
                if (sourceMap == null) {
                    throw new RuntimeException("Error in runAutoComplete():  The source map was null in the JSON response");
                }

                // Add the sourceMap to the list of maps
                listOfMaps.add(sourceMap);
            }
        }

        Integer totalRows = null;

        // Get the total rows from the json
        if (listOfMaps.size() == 0) {
            // Setting the totalRows to zero tells the ag-grid that there are no records -- and so do not show the "Loading" and do not enable infinite scrolling
            totalRows = 0;
        }


        GridGetRowsResponseDTO responseDTO = new GridGetRowsResponseDTO(listOfMaps, totalRows, null);
        return responseDTO;
    }
}
