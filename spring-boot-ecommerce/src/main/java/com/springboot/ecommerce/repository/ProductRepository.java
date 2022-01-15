package com.springboot.ecommerce.repository;

import com.springboot.ecommerce.entity.Product;
import io.swagger.annotations.ApiOperation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.RequestParam;

@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product, Long> {
    /*
    * Built in Query method (findByCategoryId) to find all products that matches the Category Id
    * Behind the scenes, Spring will execute a query similar to SELECT * FROM product where category_id = ?
    * Spring Data REST automatically expose endpoint: http://localhost:8080/api/products/search/findByCategoryId?id=1
    */
    @ApiOperation(value = "Find a page of product by category id")
    Page<Product> findByCategoryId(@Parameter(description = "Category id", required = true) @RequestParam("id") Long id, Pageable pageable);

    @ApiOperation(value = "Search for page of product by keyword")
    Page<Product> findByNameContaining(@Parameter(description = "Search keyword", required = true) @RequestParam("keyword") String keyword, Pageable pageable);
}