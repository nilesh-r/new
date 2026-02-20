package com.enterprise.taskmanagement.controller;

import com.enterprise.taskmanagement.dto.ApiResponse;
import com.enterprise.taskmanagement.dto.ProjectRequest;
import com.enterprise.taskmanagement.entity.Project;
import com.enterprise.taskmanagement.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Project>> createProject(@Valid @RequestBody ProjectRequest request,
            Authentication authentication) {
        Project project = projectService.createProject(request, authentication.getName());
        return new ResponseEntity<>(new ApiResponse<>(true, "Project created successfully", project),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Project>>> getAllProjects() {
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Projects fetched successfully", projectService.getAllProjects()),
                HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> getProjectById(@PathVariable Long id) {
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Project fetched successfully", projectService.getProjectById(id)),
                HttpStatus.OK);
    }

    @PostMapping("/{projectId}/members/{userId}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Project>> addMember(@PathVariable Long projectId, @PathVariable Long userId) {
        Project project = projectService.addMember(projectId, userId);
        return new ResponseEntity<>(new ApiResponse<>(true, "Member added successfully", project), HttpStatus.OK);
    }
}
