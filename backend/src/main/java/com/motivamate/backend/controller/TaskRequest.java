package com.motivamate.backend.controller;

public class TaskRequest {
    private String title;
    private Long userId;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
