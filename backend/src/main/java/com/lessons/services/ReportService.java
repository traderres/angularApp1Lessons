package com.lessons.services;

import com.lessons.models.AddReportDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Service("com.lessons.services.ReportService")
public class ReportService {

    private static final Logger logger = LoggerFactory.getLogger(ReportService.class);

    @Resource
    private DataSource dataSource;

    @Resource
    private DatabaseService databaseService;


    /**
     * Attempt to add a report record to the database
     *
     * @param addReportDTO  Pass-in model object that holds all of the report fields
     */
    public void addReport(AddReportDTO addReportDTO) {
        logger.debug("addReport() started.");

        String sql = "insert into reports(id, version, name, priority, start_date, end_date) " +
                "values(:id, :version, :name, :priority, :start_date, :end_date)";

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("id", databaseService.getNextId() );
        paramMap.put("version", databaseService.getStartingVersionValue());
        paramMap.put("name", addReportDTO.getName());
        paramMap.put("priority", addReportDTO.getPriority());
        paramMap.put("start_date",addReportDTO.getStartDate());
        paramMap.put("end_date", addReportDTO.getEndDate());

        NamedParameterJdbcTemplate np = new NamedParameterJdbcTemplate(this.dataSource);

        // Execute the SQL
        int rowsCreated = np.update(sql, paramMap);

        if (rowsCreated != 1) {
            throw new RuntimeException("Critical error in addReport():  I expected to create one database record, but did not.");
        }

        logger.debug("addReport() finished.");
    }
}
