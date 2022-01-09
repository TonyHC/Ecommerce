package com.springboot.ecommerce.dto;

import com.springboot.ecommerce.entity.Address;
import com.springboot.ecommerce.entity.Customer;
import com.springboot.ecommerce.entity.Order;
import com.springboot.ecommerce.entity.OrderItem;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    @Schema(required = true)
    private Customer customer;

    @Schema(required = true)
    private Address shippingAddress;

    @Schema(required = true)
    private Address billingAddress;

    @Schema(required = true)
    private Order order;

    @Schema(required = true)
    private Set<OrderItem> orderItems;
}
