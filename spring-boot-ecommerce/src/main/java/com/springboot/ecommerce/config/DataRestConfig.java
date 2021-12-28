package com.springboot.ecommerce.config;

import com.springboot.ecommerce.entity.Product;
import com.springboot.ecommerce.entity.ProductCategory;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {
    private final EntityManager entityManager;

    public DataRestConfig(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

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

        // Call an internal helper method to expose the entity ids
        exposeIds(config);
    }

    private void exposeIds(RepositoryRestConfiguration config) {
        // Get a list of al entity classes from the entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // Create a list of the entity types
        List<Class<?>> entityClasses = new ArrayList<>();

        // Get the entity types for the entities
        for (EntityType<?> entityType : entities) {
            entityClasses.add(entityType.getJavaType());
        }

        // Expose the entity ids for the array of entity/domain types
        Class<?>[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor((domainTypes));
    }
}