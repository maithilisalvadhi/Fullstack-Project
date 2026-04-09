package com.campus.activityhub.model;

public class Notification {
    private String id;
    private String title;
    private String message;
    private String audience;
    private String date;
    private String status;

    public Notification() {
    }

    public Notification(String id, String title, String message, String audience, String date, String status) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.audience = audience;
        this.date = date;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getAudience() {
        return audience;
    }

    public void setAudience(String audience) {
        this.audience = audience;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
