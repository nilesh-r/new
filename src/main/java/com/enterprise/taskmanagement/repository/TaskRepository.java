package com.enterprise.taskmanagement.repository;

import com.enterprise.taskmanagement.entity.Task;
import com.enterprise.taskmanagement.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByProjectId(Long projectId, Pageable pageable);

    Page<Task> findByAssigneeId(Long assigneeId, Pageable pageable);

    Page<Task> findByAssigneeUsername(String username, Pageable pageable);

    Page<Task> findByStatus(TaskStatus status, Pageable pageable);
}
