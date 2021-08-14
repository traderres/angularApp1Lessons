package com.lessons.services;

import com.lessons.models.GetOnePreferenceDTO;
import com.lessons.utilities.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Service("com.lessons.services.PreferenceService")
public class PreferenceService {
    private static final Logger logger = LoggerFactory.getLogger(PreferenceService.class);

    @Resource
    private DataSource dataSource;


    /**
     * Get one preference in the system
     *
     * @param aUserid holds the unique number that identifies this user
     * @param aPreferenceName holds the preference name
     */
    public GetOnePreferenceDTO getOnePreferenceWithoutPage(int aUserid, String aPreferenceName) {
        String sql = "Select value from user_preferences where userid=:userid and name=:name";

        // Create a parameter map
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("userid", aUserid);
        paramMap.put("name",   aPreferenceName);

        NamedParameterJdbcTemplate np = new NamedParameterJdbcTemplate(this.dataSource);

        // Execute the sql to get this one value
        SqlRowSet rs = np.queryForRowSet(sql, paramMap);

        String preferenceValue = null;

        if (rs.next() ) {
            // there was a value in the database.  So, pull it out
            preferenceValue  = rs.getString("value");
        }

        GetOnePreferenceDTO dto = new GetOnePreferenceDTO(preferenceValue);
        return dto;
    }




    /**
     * Get one preference in the system
     *
     * @param aUserid holds the unique number that identifies this user
     * @param aPage holds the string that identifies this page
     * @param aPreferenceName holds the preference name
     */
    public GetOnePreferenceDTO getOnePreferenceWithPage(int aUserid, String aPreferenceName, String aPage) {
        String sql = "Select value from user_preferences where userid=:userid and page=:page and name=:name";

        // Create a parameter map
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("userid", aUserid);
        paramMap.put("page",   aPage);
        paramMap.put("name",   aPreferenceName);

        NamedParameterJdbcTemplate np = new NamedParameterJdbcTemplate(this.dataSource);

        // Execute the sql to get this one value
        SqlRowSet rs = np.queryForRowSet(sql, paramMap);

        String preferenceValue = null;

        if (rs.next() ) {
            // there was a value in the database.  So, pull it out
            preferenceValue  = rs.getString("value");
        }

        GetOnePreferenceDTO dto = new GetOnePreferenceDTO(preferenceValue);
        return dto;
    }


    /**
     * Set one preference in the system
     *
     * @param aUserid holds the unique number that identifies this user
     * @param aPage holds the string that identifies this page
     * @param aPreferenceName holds the preference name
     * @param aPreferenceValue holds the preference value
     */
    public void setPreferenceValueWithPage(int aUserid, String aPreferenceName, String aPreferenceValue, String aPage) {
        TransactionTemplate tt = new TransactionTemplate();
        tt.setTransactionManager(new DataSourceTransactionManager(this.dataSource));

        // This transaction will throw a TransactionTimedOutException after 60 seconds (causing the transaction to rollback)
        tt.setTimeout(Constants.SQL_TRANSACTION_TIMEOUT_SECS);

        tt.execute(new TransactionCallbackWithoutResult()
        {
            protected void doInTransactionWithoutResult(TransactionStatus aStatus)
            {

                // Construct the SQL to UPDATE this preference record in the database
                String sql = "update user_preferences set value=:value where userid=:userid and name=:name and page=:page";

                // Create a parameter map (to hold all of the bind variables)
                Map<String, Object> paramMap = new HashMap<>();
                paramMap.put("name",    aPreferenceName);
                paramMap.put("value",   aPreferenceValue);
                paramMap.put("userid",  aUserid);
                paramMap.put("page",    aPage);

                NamedParameterJdbcTemplate np = new NamedParameterJdbcTemplate(dataSource);

                // Execute the sql to update this record
                int rowsUpdated = np.update(sql, paramMap);

                if (rowsUpdated == 0) {
                    // The preference record was not found, so insert a record
                    sql = "insert into user_preferences(id, name, value, page, userid) " +
                            "values( nextval('seq_table_ids'), :name, :value, :page, :userid)";

                    // Insert a new record in the database
                    int rowsInserted = np.update(sql, paramMap);

                    if (rowsInserted != 1) {
                        // I should have inserted 1 record, but did not
                        throw new RuntimeException("Error in setPreferenceValueForPage():  I expected to insert 1 record.  Instead, I inserted " + rowsInserted + " records.");
                    }
                }
                else if (rowsUpdated > 1) {
                    // I updated multiple records -- this should never happen
                    throw new RuntimeException("Error in setPreferenceValueForPage():  I expected to update 1 record.  Instead, I updated " + rowsUpdated + " records.");
                }

                // Commit the transaction if I get to the end of this method
            }
        });  // end of sql transaction

    }  // end of setPreferenceValue()



    /**
     * Set one preference in the system
     *
     * @param aUserid holds the unique number that identifies this user
     * @param aPreferenceName holds the preference name
     * @param aPreferenceValue holds the preference value
     */
    public void setPreferenceValueWithoutPage(int aUserid, String aPreferenceName, String aPreferenceValue) {
        logger.debug("setPreferenceValueWithoutPage() started aUserid={}  name={}  value={}", aUserid, aPreferenceName, aPreferenceValue);

        TransactionTemplate tt = new TransactionTemplate();
        tt.setTransactionManager(new DataSourceTransactionManager(this.dataSource));

        // This transaction will throw a TransactionTimedOutException after 60 seconds (causing the transaction to rollback)
        tt.setTimeout(Constants.SQL_TRANSACTION_TIMEOUT_SECS);

        tt.execute(new TransactionCallbackWithoutResult()
        {
            protected void doInTransactionWithoutResult(TransactionStatus aStatus)
            {

                // Construct the SQL to UPDATE this preference record in the database
                String sql = "update user_preferences set value=:value where userid=:userid and name=:name";

                // Create a parameter map (to hold all of the bind variables)
                Map<String, Object> paramMap = new HashMap<>();
                paramMap.put("name",    aPreferenceName);
                paramMap.put("value",   aPreferenceValue);
                paramMap.put("userid",  aUserid);

                NamedParameterJdbcTemplate np = new NamedParameterJdbcTemplate(dataSource);

                // Execute the sql to update this record
                int rowsUpdated = np.update(sql, paramMap);

                if (rowsUpdated == 0) {
                    // The preference record was not found, so insert a record
                    sql = "insert into user_preferences(id, name, value, userid) " +
                            "values( nextval('seq_table_ids'), :name, :value, :userid)";

                    // Insert a new record in the database
                    int rowsInserted = np.update(sql, paramMap);

                    if (rowsInserted != 1) {
                        // I should have inserted 1 record, but did not
                        throw new RuntimeException("Error in setPreferenceValue():  I expected to insert 1 record.  Instead, I inserted " + rowsInserted + " records.");
                    }
                }
                else if (rowsUpdated > 1) {
                    // I updated multiple records -- this should never happen
                    throw new RuntimeException("Error in setPreferenceValue():  I expected to update 1 record.  Instead, I updated " + rowsUpdated + " records.");
                }

                // Commit the transaction if I get to the end of this method
            }
        });  // end of sql transaction

        logger.debug("setPreferenceValueWithoutPage() finished aUserid={}  name={}  value={}", aUserid, aPreferenceName, aPreferenceValue);

    }  // end of setPreferenceValue()


}


