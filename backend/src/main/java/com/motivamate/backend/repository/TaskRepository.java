package com.motivamate.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.motivamate.backend.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findAllByUser_Id(Long userId);
}
