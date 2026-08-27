package com.example.Hostel.config;

import java.util.Base64;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import com.example.Hostel.Service.CustomUserDetailService;
import com.nimbusds.jose.jwk.source.ImmutableSecret;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider(
            CustomUserDetailService customUserDetailService,
            PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(customUserDetailService);
        provider.setPasswordEncoder(passwordEncoder);

        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            DaoAuthenticationProvider daoAuthenticationProvider) {
        return new ProviderManager(daoAuthenticationProvider);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            DaoAuthenticationProvider provider,
            JwtAuthenticationConverter jwtAuthenticationConverter) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authenticationProvider(provider)
                .httpBasic(Customizer.withDefaults())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth.requestMatchers("/auth/register", "/auth/login").permitAll()
                        .anyRequest().authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Stateless for jwt
                )
                .oauth2ResourceServer(
                        oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter)))

                .logout(logout -> logout
                        .logoutUrl("/auth/logout")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(200);
                            response.getWriter()
                                    .write("Logged out successfully");
                        }));

        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();

        authoritiesConverter.setAuthoritiesClaimName("authorities");

        authoritiesConverter.setAuthorityPrefix("");

        JwtAuthenticationConverter authenticationConverter = new JwtAuthenticationConverter();

        authenticationConverter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);

        return authenticationConverter;
    }

    @Bean
    public SecretKey secretKey(@Value("${jwt.secret}") String secret) {
        byte[] decodedKey = Base64.getDecoder().decode(secret);

        return new SecretKeySpec(decodedKey, "hmacSHA256");
    }

    @Bean
    public JwtEncoder jwtEncoder(SecretKey secretKey) {
        // Convert your SecretKey to Nimbus ImmutableSecret format
        return new NimbusJwtEncoder(new ImmutableSecret<>(secretKey.getEncoded()));
    }

    @Bean
    public JwtDecoder jwtDecoder(SecretKey secretKey, @Value("${jwt.issuer}") String issuer) {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(secretKey)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();

        decoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(issuer));

        return decoder;
    }
}
