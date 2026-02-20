package com.enterprise.taskmanagement.controller;

import com.enterprise.taskmanagement.dto.ApiResponse;
import com.enterprise.taskmanagement.dto.TaskRequest;
import com.enterprise.taskmanagement.entity.Task;
import com.enterprise.taskmanagement.entity.TaskStatus;
import com.enterprise.taskmanagement.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Task>> createTask(@Valid @RequestBody TaskRequest request) {
        Task task = taskService.createTask(request);
        return new ResponseEntity<>(new ApiResponse<>(true, "Task created successfully", task), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Task>>> getAllTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return new ResponseEntity<>(
                new ApiResponse<>(true, "Tasks fetched successfully", taskService.getAllTasks(pageable)),
                HttpStatus.OK);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<Page<Task>>> getTasksByProject(
            @PathVariable Long projectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return new ResponseEntity<>(
                new ApiResponse<>(true, "Tasks fetched successfully",
                        taskService.getTasksByProject(projectId, pageable)),
                HttpStatus.OK);
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<ApiResponse<Task>> updateTaskStatus(@PathVariable Long taskId,
            @RequestParam TaskStatus status) {
        Task task = taskService.updateTaskStatus(taskId, status);
        return new ResponseEntity<>(new ApiResponse<>(true, "Task status updated successfully", task), HttpStatus.OK);
    }
}
