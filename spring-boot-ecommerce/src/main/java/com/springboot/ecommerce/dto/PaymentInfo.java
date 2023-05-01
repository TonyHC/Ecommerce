package com.springboot.ecommerce.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class PaymentInfo {
    @Schema(required = true, description = "A positive integer representing how much to charge in the " +
            "smallest currency unit (e.g., 100 cents to charge $1.00)", example = "$12.54 (USD)")
    private int amount;

    @Schema(required = true, description = "Three-letter ISO currency code, in lowercase", example = "USD")
    private String currency;

    @Schema(required = true, description = "Email address that the receipt for the resulting payment will be sent to. ",
            example = "testuser@gmail.com")
    private String receiptEmail;
}