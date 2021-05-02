package com.lessons.config;

import com.ning.http.client.AsyncHttpClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ElasticSearchResourcesConfig {

    @Value("${es.url:}")
    private String elasticSearchUrl;

    @Bean
    public ElasticSearchResources elasticSearchResources() {
        // Create a new AsyncHttpClient object
        com.ning.http.client.AsyncHttpClientConfig.Builder configBuilder = new
                com.ning.http.client.AsyncHttpClientConfig.Builder();

        configBuilder.setReadTimeout(-1);
        configBuilder.setAcceptAnyCertificate(true);
        configBuilder.setFollowRedirect(true);
        com.ning.http.client.AsyncHttpClientConfig config = configBuilder.build();
        AsyncHttpClient asyncHttpClient = new AsyncHttpClient(config);

        // Store the AsyncHttpClient and elasticSearch url in the ElasticSearchResources object
        // NOTE:  THe elastic search url is injected from the application.yaml
        //        The AsyncHttpClient is constructed with java code
        ElasticSearchResources elasticSearchResources = new
                ElasticSearchResources(this.elasticSearchUrl, asyncHttpClient);

        // Return a spring bean that holds the AsyncHttpClient and elasticsearch url
        return elasticSearchResources;
    }
}