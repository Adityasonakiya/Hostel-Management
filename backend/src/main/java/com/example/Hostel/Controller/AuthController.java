package com.example.Hostel.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Hostel.Entities.User;
import com.example.Hostel.Service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> getDetails(Authentication authentication) {
        Map<String, String> mp = new HashMap<>();
        mp.put("name", authentication.getName());

        return ResponseEntity.status(200).body(mp);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        String body = authService.register(user);
        return ResponseEntity.status(201).body(body);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestBody User user,
            HttpServletRequest request) {

        try {

            Authentication authentication = authenticationManager.authenticate(
                    UsernamePasswordAuthenticationToken.unauthenticated(
                            user.getName(),
                            user.getPassword()));

            SecurityContext context = SecurityContextHolder.createEmptyContext();

            context.setAuthentication(authentication);

            SecurityContextHolder.setContext(context);

            securityContextRepository.saveContext(
                    context,
                    request,
                    null);

            return ResponseEntity.ok(
                    user.getName() + " logged in successfully.");

        } catch (Exception ex) {

            ex.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ex.getClass().getSimpleName() + ": " + ex.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            HttpServletRequest request,
            HttpServletResponse response) {

        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        return ResponseEntity.ok("Logged out successfully");
    }

}
