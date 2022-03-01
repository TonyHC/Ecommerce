package com.springboot.ecommerce.repository;

import com.springboot.ecommerce.entity.Order;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.http.MediaType;

@RepositoryRestResource
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Operation(summary = "Find a order by tracking number")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Get a order by order tracking number",
                    content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = Order.class))}
            )}
    )
    Order findByOrderTrackingNumber(@Parameter(description = "Order tracking number", required = true) String orderTrackingNumber);

    @Operation(summary = "Find a page of orders by customer email and sorted by date created in descending order")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Get a page containing orders by customer email in descending order and sorted by date created",
                    content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = Order.class))}
            )}
    )
    Page<Order> findByCustomerEmailOrderByDateCreatedDesc(@Parameter(description = "Customer email", required = true)
                                                          @Param("email") String email, Pageable pageable);
}