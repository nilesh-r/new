package com.enterprise.taskmanagement.config;

import com.enterprise.taskmanagement.entity.Role;
import com.enterprise.taskmanagement.entity.RoleName;
import com.enterprise.taskmanagement.repository.RoleRepository;
import com.enterprise.taskmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            Arrays.stream(RoleName.values()).forEach(roleName -> {
                Role role = new Role();
                role.setName(roleName);
                roleRepository.save(role);
            });
        }

        if (!userRepository.existsByUsername("admin")) {
            com.enterprise.taskmanagement.entity.User admin = new com.enterprise.taskmanagement.entity.User();
            admin.setUsername("admin");
            admin.setEmail("admin@enterprise.com");
            admin.setPassword(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("admin"));

            Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN).orElseThrow();
            java.util.Set<Role> roles = new java.util.HashSet<>();
            roles.add(adminRole);
            admin.setRoles(roles);

            userRepository.save(admin);
        }
    }
}
