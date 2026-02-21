package com.enterprise.taskmanagement.controller;

import com.enterprise.taskmanagement.dto.ApiResponse;
import com.enterprise.taskmanagement.dto.AuthResponse;
import com.enterprise.taskmanagement.dto.LoginRequest;
import com.enterprise.taskmanagement.dto.RegisterRequest;
import com.enterprise.taskmanagement.dto.UserDto;
import com.enterprise.taskmanagement.entity.User;
import com.enterprise.taskmanagement.repository.UserRepository;
import com.enterprise.taskmanagement.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

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

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Map to safe DTO — never expose password in API response
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setEnabled(user.isEnabled());
        dto.setRoles(user.getRoles().stream()
                .map(r -> r.getName())
                .collect(java.util.stream.Collectors.toSet()));

        return new ResponseEntity<>(new ApiResponse<>(true, "User fetched", dto), HttpStatus.OK);
    }
}
