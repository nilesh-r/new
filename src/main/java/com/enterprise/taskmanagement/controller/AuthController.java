package com.enterprise.taskmanagement.controller;

import com.enterprise.taskmanagement.dto.ApiResponse;
import com.enterprise.taskmanagement.dto.AuthResponse;
import com.enterprise.taskmanagement.dto.LoginRequest;
import com.enterprise.taskmanagement.dto.RegisterRequest;
import com.enterprise.taskmanagement.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest loginRequest) {
        String token = authService.login(loginRequest);
        return new ResponseEntity<>(new ApiResponse<>(true, "Login Successful", new AuthResponse(token)),
                HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@RequestBody RegisterRequest registerRequest) {
        String response = authService.register(registerRequest);
        return new ResponseEntity<>(new ApiResponse<>(true, response, null), HttpStatus.CREATED);
    }
}
