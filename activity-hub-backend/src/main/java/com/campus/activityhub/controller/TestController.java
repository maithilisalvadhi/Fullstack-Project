package com.campus.activityhub.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class TestController {

    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("ok", true);
        response.put("service", "Campus Activity Hub Backend API");
        response.put("status", "running");
        response.put("frontend", "http://127.0.0.1:5173");
        response.put("health", "/test");
        response.put("apiBase", "/api");
        return response;
    }

    @GetMapping("/test")
    public String test() {
        return "Backend is working on the port number 8080";
    }

    @GetMapping("/error")
    public Map<String, Object> errorEndpoint() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("ok", false);
        response.put("message", "Resource not found");
        response.put("frontend", "http://127.0.0.1:5173");
        response.put("apiBase", "/api");
        return response;
    }
}