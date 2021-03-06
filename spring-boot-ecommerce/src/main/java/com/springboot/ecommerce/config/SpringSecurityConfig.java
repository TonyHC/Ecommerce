package com.springboot.ecommerce.config;

import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
public class SpringSecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // Protect endpoints /api/orders/** and /api/checkout/**
        http.authorizeRequests()
                .antMatchers("/api/orders/**", "/api/checkout/**")
                .authenticated()
                .and()
                .oauth2ResourceServer()
                .jwt();

        // Add cors filter
        http.cors();

        // Force a non-empty response body for 401 error
        Okta.configureResourceServer401ResponseBody(http);

        // Disable CSRF, since we are not using cookies for session tracking
        http.csrf().disable();
    }
}
