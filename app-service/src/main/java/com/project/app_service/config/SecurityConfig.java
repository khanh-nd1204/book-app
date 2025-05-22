package com.project.app_service.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.util.Base64;
import com.project.app_service.util.CustomJwtDecoder;
import com.project.app_service.util.JwtAuthEntryPoint;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity(securedEnabled = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class SecurityConfig {

  @Value("${jwt.base64-secret}")
  String jwtKey;

  @Bean
  public BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(10);
  }

  @Bean
  public SecurityFilterChain filterChain(
      HttpSecurity httpSecurity,
      JwtAuthEntryPoint jwtAuthEntryPoint,
      CustomJwtDecoder customJwtDecoder)
      throws Exception {
    httpSecurity
        .csrf(AbstractHttpConfigurer::disable)
        .cors(Customizer.withDefaults())
        .authorizeHttpRequests(
            auth ->
                auth.requestMatchers("/upload/**")
                    .permitAll()
                    .requestMatchers("/ws/**")
                    .permitAll()
                    .requestMatchers("/api-docs/**", "/swagger-ui/**")
                    .permitAll()
                    .requestMatchers(HttpMethod.POST, "/auth/login")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/auth/refresh")
                    .permitAll()
                    .requestMatchers(HttpMethod.POST, "/auth/reset-password")
                    .permitAll()
                    .requestMatchers(HttpMethod.POST, "/auth/activate")
                    .permitAll()
                    .requestMatchers(HttpMethod.POST, "/auth/register")
                    .permitAll()
                    .requestMatchers(HttpMethod.POST, "/auth/send-mail")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/books/**")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/categories/**")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/publishers/**")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/auth/google")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/auth/call-back")
                    .permitAll()
                    .anyRequest()
                    .authenticated())
        .oauth2ResourceServer(
            oauth2 ->
                oauth2
                    .jwt(jwtConfigurer -> jwtConfigurer.decoder(customJwtDecoder))
                    .authenticationEntryPoint(jwtAuthEntryPoint))
        .formLogin(AbstractHttpConfigurer::disable)
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
    return httpSecurity.build();
  }

  private SecretKey getSecretKey() {
    byte[] keyBytes = Base64.from(jwtKey).decode();
    return new SecretKeySpec(keyBytes, 0, keyBytes.length, MacAlgorithm.HS512.getName());
  }

  @Bean
  public JwtEncoder jwtEncoder() {
    return new NimbusJwtEncoder(new ImmutableSecret<>(getSecretKey()));
  }

  @Bean
  public JwtDecoder jwtDecoder() {
    NimbusJwtDecoder jwtDecoder =
        NimbusJwtDecoder.withSecretKey(getSecretKey()).macAlgorithm(MacAlgorithm.HS512).build();
    return token -> {
      try {
        return jwtDecoder.decode(token);
      } catch (Exception e) {
        log.error("JWT decoding failed: {}", e.getMessage());
        throw e;
      }
    };
  }

  @Bean
  public JwtAuthenticationConverter jwtAuthenticationConverter() {
    JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter =
        new JwtGrantedAuthoritiesConverter();
    grantedAuthoritiesConverter.setAuthorityPrefix("");
    grantedAuthoritiesConverter.setAuthoritiesClaimName("role");
    JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
    jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
    return jwtAuthenticationConverter;
  }
}
