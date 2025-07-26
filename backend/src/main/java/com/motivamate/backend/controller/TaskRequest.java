package com.motivamate.backend.controller;

public class TaskRequest {
    private String title;
    private int userId;
    
    
    public String getTitle() {
        return title;
    }

    // Getters and setters
    public void setTitle(String title) {
        this.title = title;
    }
    public int getUserId() {
        return userId;
    }
    public void setUserId(int userId) {
        this.userId = userId;
    }

    
}