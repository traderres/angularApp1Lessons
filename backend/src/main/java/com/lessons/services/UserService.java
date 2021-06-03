
package com.lessons.services;

import com.lessons.security.UserInfo;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;
import javax.sql.DataSource;

@Service("com.lessons.services.UserService")
public class UserService {

    @Resource
    private DataSource dataSource;

    /**
     * @return the UserInfo object from Spring-Security
     */
    public UserInfo getUserInfo() {
        // Get the UserInfo object from Spring Security
        SecurityContext securityContext = SecurityContextHolder.getContext();

        if (securityContext == null) {
            throw new RuntimeException("Error in getUserInfoFromSecurity():  SecurityContext is null.  This should never happen.");
        }

        Authentication auth = securityContext.getAuthentication();
        if (auth == null) {
            throw new RuntimeException("Error in getUserInfoFromSecurity():  Authentication is null.  This should never happen.");
        }

        UserInfo userInfo = (UserInfo) auth.getPrincipal();
        if (userInfo == null) {
            throw new RuntimeException("Error in getUserInfoFromSecurity():  UserInfo is null.  This should never happen.");
        }

        return userInfo;
    }


    /**
     * @return The name of the logged-in user
     */
    public String getLoggedInUserName() {
        UserInfo userinfo = getUserInfo();

        return userinfo.getUsername();
    }

    /**
     * @return The ID of the logged-in user
     */
    public Integer getLoggedInUserId() {
        UserInfo userinfo = getUserInfo();

        return userinfo.getId();
    }


    public Integer getOrAddUserRecordsToSystem(String aUsername) {
        JdbcTemplate jt = new JdbcTemplate(this.dataSource);
        Integer userid = 25;

//        // Query the database to see if the id exists
//        String sql = "select id from users where username=?";
//        SqlRowSet rs = jt.queryForRowSet(sql, aUsername);
//
//        if (rs.next()) {
//            // This record already exists in the system -- so return it
//             userid = rs.getInt("id");
//        }
//        else {
//            // This record does not exist -- so add it
//            sql = "insert into users(id, version, full_name, username, password, email, phone_number, is_locked, is_registered)\n" +
//                  "values(nextval('seq_table_ids'), 1, 'John Smith', ?, 'secret', null, null, false, true) returning id";
//
//            userid = jt.queryForObject(sql, Integer.class, aUsername);
//        }
//
        return userid;
    }


}
