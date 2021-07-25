package com.lessons.utilities;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.Objects;

@ControllerAdvice
public class MyExceptionHandler
{
    private static final Logger logger = LoggerFactory.getLogger(MyExceptionHandler.class);

    @Value("${exception_handler.return_dev_info:false}")
    private boolean showDevelopmentInfo;

    /*
     * handleException()
     *
     * This is the Global Exception Handler
     */
    @ExceptionHandler( Exception.class )
    public ResponseEntity<?> handleException(Exception aException)
    {
        HttpServletRequest request = ((ServletRequestAttributes) Objects.requireNonNull(RequestContextHolder.getRequestAttributes())).getRequest();

        // Log the error *and* stack trace
        if (null != request) {
            logger.error("Exception raised from call to " + request.getRequestURI(), aException);
        } else {
            logger.error("Exception raised from null request.", aException);
        }

        // Return a ResponseEntity with media type as text_plain so that the
        // does not convert this to a JSON map
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);

        if (showDevelopmentInfo) {
            // I am in developer mode so send the *real* error message to the front-end

            // Construct the message (to be returned to the frontend)
            String mesg = aException.getLocalizedMessage();

            // Return the message
            return new ResponseEntity<>(mesg, headers, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        else {
            // I am in production mode so send a *generic* error message to the front-end
            return new ResponseEntity<>("Something went wrong. Please contact an administrator.", headers, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

