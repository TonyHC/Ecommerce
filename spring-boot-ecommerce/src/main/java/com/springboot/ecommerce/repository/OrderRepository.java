package com.springboot.ecommerce.repository;

import com.springboot.ecommerce.entity.Order;
import io.swagger.annotations.ApiOperation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @ApiOperation(value = "Search order by order tracking number")
    Order findByOrderTrackingNumber(@Parameter(description = "Order tracking number", required = true)  String orderTrackingNumber);
}