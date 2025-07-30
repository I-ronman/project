
package com.Ironman.back.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    	 System.out.println(" SecurityFilterChain LOADED!");
    	
    	http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/oauth/**", "/css/**", "/js/**", "/images/**", "/email/**",      //  이메일 인증 관련 요청 허용
                        "/signup","/login","/api/routine/add", "/api/routine/list","/login/check"     ).permitAll() // 비로그인 허용 경로
                .anyRequest().authenticated() // 나머지는 인증 필요
            )
            .formLogin(form -> form.disable())            
            .oauth2Login(oauth2 -> oauth2.disable());
            

        return http.build();
    }
    
    
     // CORS 설정 (React 연동용)
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
            CorsConfiguration config = new CorsConfiguration();

            config.setAllowedOrigins(List.of("http://localhost:5173"));
            config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            config.setAllowedHeaders(List.of("*"));
            config.setAllowCredentials(true); // withCredentials: true 대응

            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            source.registerCorsConfiguration("/**", config);

            return source;
    }
        
}

