package com.springboot.ecommerce.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class PurchaseResponse {
    @Schema(description = "Order tracking number based on uuid", example = "3df735d0-f345-4ea9-ae50-30286376b547")
    private final String orderTrackingNumber;
}
