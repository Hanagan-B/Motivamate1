package com.motivamate.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.motivamate.backend.model.Task;
import com.motivamate.backend.model.User;
import com.motivamate.backend.repository.TaskRepository;
import com.motivamate.backend.repository.UserRepository;

@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepo;
    @Autowired
    private UserRepository userRepo;

    @PostMapping("/add")
    public ResponseEntity<Task> addTask(@RequestBody TaskRequest request) {

        Long userId = request.getUserId();
        User user = userRepo.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        Task task = new Task();
        task.setText(request.getTitle());
        task.setCompleted(false);
        task.setUser(user);

        Task saved = taskRepo.save(task);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Task>> getTasksByUser(@PathVariable Long userId) {

        List<Task> tasks = taskRepo.findByUser_Id(userId);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping("/complete/{taskId}")
    public ResponseEntity<String> completeTask(@PathVariable Long taskId) {
        Task task = taskRepo.findById(taskId).orElse(null);
        if (task == null) {
            return ResponseEntity.badRequest().body("Task not found.");
        }
        if (task.isCompleted()) {
            return ResponseEntity.badRequest().body("Task already completed.");
        }

        // mark completed
        task.setCompleted(true);
        taskRepo.save(task);

        //add XP
        User user = task.getUser();
        if (user != null) {
            user.setXp(user.getXp() + 10);
            userRepo.save(user);
        }

        return ResponseEntity.ok("Task completed. XP added.");
    }
}
