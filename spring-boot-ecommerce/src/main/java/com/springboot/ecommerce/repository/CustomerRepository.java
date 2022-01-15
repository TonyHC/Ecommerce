package com.springboot.ecommerce.repository;

import com.springboot.ecommerce.entity.Customer;
import io.swagger.annotations.ApiOperation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    @ApiOperation(value = "Find a customer by email")
    Customer findByEmail(String email);
}