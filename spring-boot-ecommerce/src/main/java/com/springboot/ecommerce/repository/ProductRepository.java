package com.springboot.ecommerce.repository;

import com.springboot.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin("http://localhost:4200")
public interface ProductRepository extends JpaRepository<Product, Long> {
    /*
    * Built in Query method (findByCategoryId) to find all products that matches the Category Id
    * Behind the scenes, Spring will execute a query similar to SELECT * FROM product where category_id = ?
    * Spring Data REST automatically expose endpoint: http://localhost:8080/api/products/search/findByCategoryId?id=1
    */
    Page<Product> findByCategoryId(@RequestParam("id") Long id, Pageable pageable);

    Page<Product> findByNameContaining(@RequestParam("keyword") String keyword, Pageable pageable);
}