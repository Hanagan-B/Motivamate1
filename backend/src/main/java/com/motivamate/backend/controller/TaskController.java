package com.motivamate.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // IMPORTANTE
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
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
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class TaskController {

    @Autowired private TaskRepository taskRepo;
    @Autowired private UserRepository userRepo;

    public static record AddTaskReq(String title) {}

    @GetMapping
    public List<Task> myTasks(Authentication auth) {
        String email = auth.getName();
        User user = userRepo.findByEmail(email).orElseThrow();
        return taskRepo.findAllByUser_Id(user.getId());
    }

    @PostMapping("/add")
    public ResponseEntity<Task> add(Authentication auth, @RequestBody AddTaskReq req) {
        String email = auth.getName();
        User user = userRepo.findByEmail(email).orElseThrow();

        Task t = new Task();
        t.setText(req.title());
        t.setCompleted(false);
        t.setUser(user);

        taskRepo.save(t);
        return ResponseEntity.ok(t);
    }

    @PostMapping("/complete/{id}")
    public ResponseEntity<?> complete(Authentication auth, @PathVariable Long id) {
        String email = auth.getName();
        User user = userRepo.findByEmail(email).orElseThrow();

        Task t = taskRepo.findById(id).orElse(null);
        if (t == null || !t.getUser().getId().equals(user.getId()))
            return ResponseEntity.status(404).body("Task não encontrada");

        if (!t.isCompleted()) {
            t.setCompleted(true);
            taskRepo.save(t);
            user.setXp(user.getXp() + 10);
            userRepo.save(user);
        }
        return ResponseEntity.ok(Map.of("message", "Task completada"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(Authentication auth, @PathVariable Long id) {
        String email = auth.getName();
        User user = userRepo.findByEmail(email).orElseThrow();

        Task t = taskRepo.findById(id).orElse(null);
        if (t == null || !t.getUser().getId().equals(user.getId()))
            return ResponseEntity.status(404).body("Task não encontrada");

        taskRepo.delete(t);
        return ResponseEntity.noContent().build();
    }
}
