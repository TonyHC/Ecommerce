package com.springboot.ecommerce.config;

import com.springboot.ecommerce.entity.Product;
import com.springboot.ecommerce.entity.ProductCategory;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        RepositoryRestConfigurer.super.configureRepositoryRestConfiguration(config, cors);
        HttpMethod[] unsupportedHttpActions = {HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE};

        // Disable Http methods for POST, PUT, and DELETE
        config.getExposureConfiguration()
                .forDomainType(Product.class)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedHttpActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedHttpActions));

        // Disable Http methods for POST, PUT, and DELETE
        config.getExposureConfiguration()
                .forDomainType(ProductCategory.class)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedHttpActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedHttpActions));
    }
}