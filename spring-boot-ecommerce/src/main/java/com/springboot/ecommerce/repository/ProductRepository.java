package com.springboot.ecommerce.repository;

import com.springboot.ecommerce.entity.Product;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestParam;

@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product, Long> {
    /*
    * Built in Query method (findByCategoryId) to find all products that matches the Category Id
    * Behind the scenes, Spring will execute a query similar to SELECT * FROM product where category_id = ?
    * Spring Data REST automatically expose endpoint: http://localhost:8080/api/products/search/findByCategoryId?id=1
    */
    @Operation(summary = "Find a page of product by category id")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Get a product by category id",
                    content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = Product.class))}
            )}
    )
    Page<Product> findByCategoryId(@Parameter(description = "Category id", required = true)
                                   @RequestParam("id") Long id, Pageable pageable);

    @Operation(summary = "Search for page of products by keyword")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Get a page containing products by keyword",
                    content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = Product.class))}
            )}
    )
    Page<Product> findByNameContaining(@Parameter(description = "Search keyword", required = true)
                                       @RequestParam("keyword") String keyword, Pageable pageable);
}