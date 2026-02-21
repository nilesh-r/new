package com.enterprise.taskmanagement.dto;

import com.enterprise.taskmanagement.entity.RoleName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private boolean enabled;
    private Set<RoleName> roles; // Flat set of role names like ROLE_ADMIN
}
