<<<<<<< HEAD
package com.Ironman.back.config;
=======
package com.Ironman.back.controller;
>>>>>>> 8dda8c4bf7fd7ce37b70fe92f556514fc6270d6b

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

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
<<<<<<< HEAD
                        "/signup"     ).permitAll() // 비로그인 허용 경로
                .anyRequest().authenticated() // 나머지는 인증 필요
            )
            .oauth2Login(oauth2 -> oauth2
                .loginPage("/login") // 프론트 커스텀 로그인 페이지 경로
                .defaultSuccessUrl("/oauth/success", true) // 로그인 성공시 이동 경로
=======
                        "/signup","/login"     ).permitAll() // 비로그인 허용 경로
                .anyRequest().authenticated() // 나머지는 인증 필요
            )
            .formLogin(form -> form
                    .loginPage("/loginPage")  // 시큐리티 로그인 페이지 (context path 제외)
                    .permitAll()
            )
            .oauth2Login(oauth2 -> oauth2
                .loginPage("/loginPage") // 프론트 커스텀 로그인 페이지 경로
                .defaultSuccessUrl("http://localhost:5173", true) // 로그인 성공시 이동 경로
>>>>>>> 8dda8c4bf7fd7ce37b70fe92f556514fc6270d6b
            );

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

