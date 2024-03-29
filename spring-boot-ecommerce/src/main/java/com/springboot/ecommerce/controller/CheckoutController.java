package com.springboot.ecommerce.controller;

import com.springboot.ecommerce.dto.PaymentInfo;
import com.springboot.ecommerce.dto.Purchase;
import com.springboot.ecommerce.dto.PurchaseResponse;
import com.springboot.ecommerce.service.CheckoutService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import io.swagger.annotations.Api;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/checkout")
@Api(
        tags = "Checkout"
)
public class CheckoutController {
    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @Operation(summary = "Place a order")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Create a new order",
                    content = @Content(mediaType = "application/json",
                        schema = @Schema(implementation = PurchaseResponse.class))
            )}
    )
    @PostMapping(value = "/purchase", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public PurchaseResponse placeOrder(@Valid @RequestBody Purchase purchase) {
        return this.checkoutService.placeOrder(purchase);
    }

    @Operation(summary = "Create a PaymentIntent")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Create a PaymentIntent object",
                    content = @Content(mediaType = "application/json",
                        schema = @Schema(implementation = PaymentInfo.class))
            )
    })
    @PostMapping(value = "/payment-intent", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createPaymentIntent(@Valid @RequestBody PaymentInfo paymentInfo) throws StripeException {
        PaymentIntent paymentIntent = checkoutService.createPaymentIntent(paymentInfo);
        String paymentStr = paymentIntent.toJson();
        return new ResponseEntity<>(paymentStr, HttpStatus.OK);
    }
}