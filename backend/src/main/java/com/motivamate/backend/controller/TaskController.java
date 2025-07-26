package com.motivamate.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.motivamate.backend.model.Task;
import com.motivamate.backend.model.User;
import com.motivamate.backend.repository.TaskRepository;
import com.motivamate.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepo;
    @Autowired
    private UserRepository userRepo;

    public ResponseEntity<Task> addTask(@RequestBody TaskRequest request) {
        // Find user by ID
        User user = userRepo.findById((long) request.getUserId()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().build(); // user doesn't exist
        }

        // Create task
        Task task = new Task(user);
        task.setText(request.getTitle());
        task.setUser(user);
        task.setCompleted(false);

        taskRepo.save(task);
        return ResponseEntity.ok(task);
    }

    @GetMapping("/user/{userId}")
    public List<Task> getTasksByUser(@PathVariable int userId) {
        return (List<Task>) taskRepo.findById(userId);
    }

    @PostMapping("/complete/{taskId}")
    public ResponseEntity<String> completeTask(@PathVariable int taskId) {
        Task task = ((Optional<Task>) taskRepo.findById(taskId)).orElse(null);
        if (task != null && !task.isCompleted()) {
            task.setCompleted(true);
            taskRepo.save(task);

            User user = userRepo.findById(task.getId()).orElse(null);
            if (user != null) {
                user.setXp(user.getXp() + 10); // +10 XP per task
                userRepo.save(user);
            }

            return ResponseEntity.ok("Task completed. XP added.");
        }
        return ResponseEntity.badRequest().body("Task not found or already completed.");
    }
}
