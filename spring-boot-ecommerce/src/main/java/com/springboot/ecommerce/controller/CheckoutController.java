package com.springboot.ecommerce.controller;

import com.springboot.ecommerce.dto.Purchase;
import com.springboot.ecommerce.dto.PurchaseResponse;
import com.springboot.ecommerce.service.CheckoutService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {
    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {
        return this.checkoutService.placeOrder(purchase);
    }
}