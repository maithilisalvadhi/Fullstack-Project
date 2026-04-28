package com.campus.activityhub.model;

public class Registration {
    private String id;
    private String activityId;
    private String student;
    private String status;

    public Registration() {
    }

    public Registration(String id, String activityId, String student, String status) {
        this.id = id;
        this.activityId = activityId;
        this.student = student;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getActivityId() {
        return activityId;
    }

    public void setActivityId(String activityId) {
        this.activityId = activityId;
    }

    public String getStudent() {
        return student;
    }

    public void setStudent(String student) {
        this.student = student;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
