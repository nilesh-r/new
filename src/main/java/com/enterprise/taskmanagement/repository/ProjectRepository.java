package com.enterprise.taskmanagement.repository;

import com.enterprise.taskmanagement.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByManagerUsername(String username);

    List<Project> findByMembersUsername(String username);
}
