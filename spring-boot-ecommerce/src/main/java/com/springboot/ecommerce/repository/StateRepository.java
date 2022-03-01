package com.springboot.ecommerce.repository;

import com.springboot.ecommerce.entity.State;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.http.MediaType;

import java.util.List;

@RepositoryRestResource
public interface StateRepository extends JpaRepository<State, Long> {
    @Operation(summary = "Find list of states by country code")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Get states by country code",
                    content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = State.class))}
            )}
    )
    List<State> findByCountryCode(@Parameter(description = "Country code", required = true) @Param("code") String code);
}