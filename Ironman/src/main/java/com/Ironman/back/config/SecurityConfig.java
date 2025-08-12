package com.Ironman.back.config;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        System.out.println(" SecurityFilterChain LOADED!");

        http
            // CORS 먼저 적용
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )
            .authorizeHttpRequests(auth -> auth
                // 프리플라이트 전역 허용
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // 비로그인 허용 경로
                .requestMatchers(
                    "/oauth/**", "/css/**", "/js/**", "/images/**", "/email/**",
                    "/signup", "/login", "/login/check", "/login/user",
                    "/api/routine/**", "/api/survey/**", "/api/posture/**", "/api/exercise/**"
                ).permitAll()

                // 그 외 인증 필요
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                })
            )
            .formLogin(form -> form.disable())
            .oauth2Login(oauth2 -> oauth2
                .defaultSuccessUrl("/oauth/success", true)
            );

        return http.build();
    }

    // === CORS 설정 (환경변수 기반) ===
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 환경변수 CORS_ALLOWED_ORIGINS 없으면 로컬 기본값
        String originsEnv = System.getenv("CORS_ALLOWED_ORIGINS");
        if (originsEnv == null || originsEnv.isBlank()) {
            originsEnv = "http://localhost:5173";
        }
        List<String> origins = Arrays.stream(originsEnv.split(","))
                                     .map(String::trim)
                                     .filter(s -> !s.isEmpty())
                                     .collect(Collectors.toList());

        // credentials 사용 시 '*' 금지
        config.setAllowedOrigins(origins);
        config.setAllowCredentials(true);

        // 메서드/헤더
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        // 필요 시 노출 헤더 추가
        // config.setExposedHeaders(List.of("Authorization"));

        // 캐시 시간(초)
        config.setMaxAge(3600L);

        // 전 경로에 적용
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}