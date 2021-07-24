package com.lessons.services;

import com.lessons.models.grid.GridGetRowsRequestDTO;
import com.lessons.models.grid.GridGetRowsResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Arrays;
import java.util.HashMap;
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
    public GridGetRowsResponseDTO getRows(GridGetRowsRequestDTO aGridRequestDTO) {


        GridGetRowsResponseDTO responseDTO = new GridGetRowsResponseDTO();

        Map<String, Object> map1 = new HashMap<>();
        map1.put("id", 1);
        map1.put("name", "Report 1");
        map1.put("priority", "low");
        map1.put("start_date", "05/02/2021");
        map1.put("end_date",   "06/03/2021");

        Map<String, Object> map2 = new HashMap<>();
        map2.put("id", 2);
        map2.put("name", "Report 2");
        map1.put("priority", "low");
        map2.put("start_date", "05/02/2022");
        map2.put("end_date",   "06/03/2022");

        Map<String, Object> map3 = new HashMap<>();
        map3.put("id", 3);
        map3.put("name", "Report 3");
        map1.put("priority", "medium");
        map3.put("start_date", "05/02/2023");
        map3.put("end_date",   "06/03/2023");

        List<Map<String, Object>> listOfData = Arrays.asList(map1, map2, map3);

        responseDTO.setData(listOfData);
        responseDTO.setLastRow(3);

        return responseDTO;
    }
}
