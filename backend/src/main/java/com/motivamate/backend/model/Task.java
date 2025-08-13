package com.motivamate.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;            
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String text;

    @Column(nullable = false)
    private boolean completed = false;

    @JsonIgnore // Avoid recursion in JSON serialization
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // --- CONSTRUCTORS ---
    // Default constructor for JPA
    public Task() {}
    public Task(String text, User user) {
        this.text = text;
        this.user = user;
        this.completed = false;
    }

    //  --- GETTERS AND SETTERS ---
    // Getters and setters for all fields
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    // Export only the user ID (without serializing the entire object)
    @Transient
    public Long getUserId() {
        return user != null ? user.getId() : null;
    }
}
