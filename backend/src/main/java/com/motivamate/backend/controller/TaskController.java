package com.motivamate.backend.controller;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.motivamate.backend.model.Task;
import com.motivamate.backend.model.User;
import com.motivamate.backend.repository.TaskRepository;
import com.motivamate.backend.repository.UserRepository;

import jakarta.validation.Valid;

@CrossOrigin(
  origins = {"http://127.0.0.1:5500", "http://localhost:5500"},
  allowedHeaders = {"*"},
  methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepo;
    @Autowired
    private UserRepository userRepo;

    // CREATE — POST /api/tasks  (antes era /add)
    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody TaskRequest request) {
        Long userId = request.getUserId();
        User user = userRepo.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        Task task = new Task();
        task.setText(request.getTitle().trim());
        task.setCompleted(false);
        task.setUser(user);

        Task saved = taskRepo.save(task);
        return ResponseEntity
                .created(URI.create("/api/tasks/" + saved.getId()))
                .body(saved);
    }

    // READ — GET /api/tasks/{taskId}
    @GetMapping("/{taskId}")
    public ResponseEntity<Task> getById(@PathVariable Long taskId) {
        Task task = taskRepo.findById(taskId).orElse(null);
        if (task == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(task);
    }

    // LIST BY USER — GET /api/tasks/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Task>> getTasksByUser(@PathVariable Long userId) {
        List<Task> tasks = taskRepo.findByUser_Id(userId);
        return ResponseEntity.ok(tasks);
    }

    // PARTIAL UPDATE — PATCH /api/tasks/{taskId}
    @PatchMapping("/{taskId}")
    @Transactional
    public ResponseEntity<Task> updatePartial(@PathVariable Long taskId,
                                              @RequestBody UpdateTaskRequest req) {
        Task task = taskRepo.findById(taskId).orElse(null);
        if (task == null) return ResponseEntity.notFound().build();

        boolean wasCompleted = task.isCompleted();

        if (req.getTitle() != null && !req.getTitle().isBlank()) {
            task.setText(req.getTitle().trim());
        }
        if (req.getCompleted() != null) {
            boolean newCompleted = req.getCompleted();
            task.setCompleted(newCompleted);

            if (newCompleted && !wasCompleted) {
                addXp(task.getUser(), 10);
            } else if (!newCompleted && wasCompleted) {
                addXp(task.getUser(), -10); // simétrico ao concluir
            }
        }

        Task saved = taskRepo.save(task);
        return ResponseEntity.ok(saved);
    }

    // COMPLETE — POST /api/tasks/complete/{taskId}
    @PostMapping("/complete/{taskId}")
    @Transactional
    public ResponseEntity<?> completeTask(@PathVariable Long taskId) {
        Task task = taskRepo.findById(taskId).orElse(null);
        if (task == null) return ResponseEntity.notFound().build();
        if (task.isCompleted()) return ResponseEntity.status(409).body("Task already completed.");

        task.setCompleted(true);
        taskRepo.save(task);
        addXp(task.getUser(), 10);

        return ResponseEntity.ok(task);
    }

    // UNCOMPLETE — POST /api/tasks/{taskId}/uncomplete
    @PostMapping("/{taskId}/uncomplete")
    @Transactional
    public ResponseEntity<?> uncompleteTask(@PathVariable Long taskId) {
        Task task = taskRepo.findById(taskId).orElse(null);
        if (task == null) return ResponseEntity.notFound().build();
        if (!task.isCompleted()) return ResponseEntity.status(409).body("Task is already not completed.");

        task.setCompleted(false);
        taskRepo.save(task);
        addXp(task.getUser(), -10);

        return ResponseEntity.ok(task);
    }

    // DELETE — DELETE /api/tasks/{taskId}
    @DeleteMapping("/{taskId}")
    @Transactional
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        Task task = taskRepo.findById(taskId).orElse(null);
        if (task == null) return ResponseEntity.notFound().build();
        taskRepo.delete(task);
        return ResponseEntity.noContent().build();
    }

    // ===== Helpers =====
    private void addXp(User user, int delta) {
        if (user == null) return;
        // Se seu campo for 'int', não existe null; se for 'Integer', funciona igual.
        int current = user.getXp(); // ajuste seu User para 'private int xp = 0;'
        int updated = Math.max(0, current + delta);
        user.setXp(updated);
        userRepo.save(user);
    }

    // DTO for PATCH
    public static class UpdateTaskRequest {
        private String title;
        private Boolean completed;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public Boolean getCompleted() { return completed; }
        public void setCompleted(Boolean completed) { this.completed = completed; }
    }
}
