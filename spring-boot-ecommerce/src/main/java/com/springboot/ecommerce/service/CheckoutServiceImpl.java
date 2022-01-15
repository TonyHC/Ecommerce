package com.springboot.ecommerce.service;

import com.springboot.ecommerce.entity.Customer;
import com.springboot.ecommerce.entity.Order;
import com.springboot.ecommerce.entity.OrderItem;
import com.springboot.ecommerce.repository.CustomerRepository;
import com.springboot.ecommerce.dto.Purchase;
import com.springboot.ecommerce.dto.PurchaseResponse;
import com.springboot.ecommerce.repository.OrderRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;

    public CheckoutServiceImpl(CustomerRepository customerRepository, OrderRepository orderRepository) {
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        // Extract order data from purchase dto
        Order order = purchase.getOrder();

        // Generate and set a unique uuid not found within the db as the order's tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        // Extract collection of order items data and add to order data
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.addOrderItem(item));

        // Extract and set the billing and shipping address data to order data
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        // Extract the customer data and customer email to determine whether customer exists or is new
        Customer customer = purchase.getCustomer();
        String customerEmail = customer.getEmail();

        // Check if this is an existing customer
        Customer customerFromDB = customerRepository.findByEmail(customerEmail);
        if (customerFromDB != null) {
            // Existing customer
            customer = customerFromDB;
        }

        // Add order to associated customer (existing or new)
        customer.addOrder(order);

        // Save the customer data containing the order, order item, billing and shipping address data into db
        customerRepository.save(customer);

        // Return a purchase response dto containing the unique uuid for order tracking number
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        // Generate a random UUID number for tracking number
        String trackingNumber = UUID.randomUUID().toString();

        // Query the database orders table to check if orderTrackingNumber generated from uuid is unique
        while (orderRepository.findByOrderTrackingNumber(trackingNumber) != null) {
            trackingNumber = UUID.randomUUID().toString();
        }

        return trackingNumber;
    }
}
