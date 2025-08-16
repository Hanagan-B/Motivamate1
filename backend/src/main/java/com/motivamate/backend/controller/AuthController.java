package com.motivamate.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // <-- correto (Spring)
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.motivamate.backend.model.User;
import com.motivamate.backend.repository.UserRepository;
import com.motivamate.backend.security.JwtService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://127.0.0.1:5500") // ajuste se precisar
public class AuthController {

    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtService jwt;

    public static record RegisterReq(String name, String email, String password) {}
    public static record LoginReq(String email, String password) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterReq req) {
        if (req.email() == null || req.password() == null) return ResponseEntity.badRequest().build();
        if (userRepo.findByEmail(req.email()).isPresent()) return ResponseEntity.badRequest().body("Email já cadastrado");

        User u = new User();
        u.setName(req.name() != null ? req.name() : "User");
        u.setEmail(req.email());
        u.setPasswordHash(passwordEncoder.encode(req.password()));
        u.setXp(0);

        userRepo.save(u);

        String token = jwt.generateToken(u.getEmail());
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginReq req) {
        User u = userRepo.findByEmail(req.email()).orElse(null);
        if (u == null) return ResponseEntity.status(401).body("Credenciais inválidas");

        if (!passwordEncoder.matches(req.password(), u.getPasswordHash()))
            return ResponseEntity.status(401).body("Credenciais inválidas");

        String token = jwt.generateToken(u.getEmail());
        Map<String, Object> payload = new HashMap<>();
        payload.put("token", token);
        payload.put("name", u.getName());
        return ResponseEntity.ok(payload);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        String email = auth.getName();
        User u = userRepo.findByEmail(email).orElse(null);
        if (u == null) return ResponseEntity.status(401).build();

        Map<String, Object> me = new HashMap<>();
        me.put("id", u.getId());
        me.put("name", u.getName());
        me.put("email", u.getEmail());
        me.put("xp", u.getXp());
        return ResponseEntity.ok(me);
    }
}
