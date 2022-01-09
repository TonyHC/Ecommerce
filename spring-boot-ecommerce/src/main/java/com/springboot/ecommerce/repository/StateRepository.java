package com.springboot.ecommerce.repository;

import com.springboot.ecommerce.entity.State;
import io.swagger.annotations.ApiOperation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin("http://localhost:4200")
public interface StateRepository extends JpaRepository<State, Long> {
    @ApiOperation(value = "Find list of states by country code")
    List<State> findByCountryCode(@Parameter(description = "Country code", required = true) @Param("code") String code);
}