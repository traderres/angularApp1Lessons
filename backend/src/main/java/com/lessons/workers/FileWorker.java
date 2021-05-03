package com.lessons.workers;

import com.lessons.services.JobService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.InputStream;
import java.util.concurrent.Callable;


public class FileWorker implements Callable<String> {
    private static final Logger logger = LoggerFactory.getLogger(FileWorker.class);

    private final Integer jobId;                              // Holds the jobId for this job
    private final InputStream inputStream;                    // Holds the inputStream of the uploaded file
    private final JobService jobService;                      // Holds a reference to the JobService so we can use it here



    /**
     * FileWorker constructor.  This is used to pass-in Spring services and other dependencies
     * @param aJobId holds the ID that uniquely identifies this job
     * @param aInputStream Holds the inputStream corresponding to the uploaded file
     * @param aJobService Holds a reference to the JobService (which is used to upload the job status)
     */
    public FileWorker(Integer aJobId, InputStream aInputStream, JobService aJobService) {
        this.jobId = aJobId;
        this.inputStream = aInputStream;
        this.jobService = aJobService;
    }


    /**
     * Perform the work in the background and update the Jobs record as it progresses
     *
     * @return a string that is not used
     */
    @Override
    public String call()  {
        try {
            logger.debug("call() started for jobId={}", this.jobId);

            Thread.sleep(3000);

            // Mark this job as 25% complete in the database
            this.jobService.updateJobRecord(this.jobId, JobService.JOB_STATE_WORK_IN_PROGRESS, 25);


            Thread.sleep(3000);

            // Mark this job as 50% complete in the database
            this.jobService.updateJobRecord(this.jobId, JobService.JOB_STATE_WORK_IN_PROGRESS, 50);



            Thread.sleep(3000);

            // Mark this job as 25% complete in the database
            this.jobService.updateJobRecord(this.jobId, JobService.JOB_STATE_WORK_IN_PROGRESS, 75);

            Thread.sleep(3000);

            // Mark this job as finished successfully (so the front-end will know to stop polling)
            this.jobService.updateJobRecordAsSucceeded(this.jobId);

            logger.debug("call() finished for jobId={}", this.jobId);
        }
        catch (Exception e) {
            // Mark this job as finished with failure  (so the front-end will know to stop polling)
            this.jobService.updateJobRecordAsFailed(this.jobId, e.getMessage());
        }

        return null;
    }
}
