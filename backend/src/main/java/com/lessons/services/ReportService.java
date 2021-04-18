package com.lessons.services;

import com.lessons.models.AddReportDTO;
import com.lessons.models.GetReportDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.util.HashMap;
import java.util.List;
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

    /**
     * @return a List of all Reports (as a list of GetReportDTO objects)
     */
    public List<GetReportDTO> getAllReports() {
        // Construct the SQL to get all reports
        String sql = "select id, name, priority, to_char(start_date, 'mm/dd/yyyy') as start_date, to_char(end_date, 'mm/dd/yyyy') as end_date " +
                     "from reports " +
                     "order by id";

        // Use the rowMapper to convert the results into a list of GetReportDTO objects
        BeanPropertyRowMapper<GetReportDTO> rowMapper = new BeanPropertyRowMapper<>(GetReportDTO.class);

        // Execute the SQL and Convert the results into a list of GetReportDTO objects
        JdbcTemplate jt = new JdbcTemplate(this.dataSource);
        List<GetReportDTO> listOfReports = jt.query(sql, rowMapper);

        // Return the list of GetReportDTO objects
        return listOfReports;
    }
}
