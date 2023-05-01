package com.springboot.ecommerce.service;

import com.springboot.ecommerce.dto.PaymentInfo;
import com.springboot.ecommerce.entity.Customer;
import com.springboot.ecommerce.entity.Order;
import com.springboot.ecommerce.entity.OrderItem;
import com.springboot.ecommerce.entity.Product;
import com.springboot.ecommerce.repository.CustomerRepository;
import com.springboot.ecommerce.dto.Purchase;
import com.springboot.ecommerce.dto.PurchaseResponse;
import com.springboot.ecommerce.repository.OrderRepository;
import com.springboot.ecommerce.repository.ProductRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService {
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public CheckoutServiceImpl(CustomerRepository customerRepository, OrderRepository orderRepository,
                               ProductRepository productRepository, @Value("${stripe.key.secret}") String stripeSecretKey) {
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;

        // Initialize Stripe API with secret key
        Stripe.apiKey = stripeSecretKey;
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

        // Update the unit of stock for each product
        updateProductUnitInStock(orderItems);

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

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
        // Specify the allowed payment methods used by the PaymentIntent
        List<String> paymentMethodTypes = new ArrayList<>();

        paymentMethodTypes.add("card");

        // Specify the parameters for the PaymentIntent
        Map<String, Object> params = new HashMap<>();

        params.put("amount", paymentInfo.getAmount());
        params.put("currency", paymentInfo.getCurrency());
        params.put("receipt_email", paymentInfo.getReceiptEmail());
        params.put("payment_method_types", paymentMethodTypes);
        params.put("description", "Ecom purchase");

        // Create and return a PaymentIntent object using the above parameters
        return PaymentIntent.create(params);
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

    private void updateProductUnitInStock(Set<OrderItem> orderItems) {
        orderItems.forEach(orderItem -> {
            Product product = this.productRepository.getById(orderItem.getProductId());
            product.setUnitsInStock(product.getUnitsInStock() - orderItem.getQuantity());
            this.productRepository.save(product);
        });
    }
}
