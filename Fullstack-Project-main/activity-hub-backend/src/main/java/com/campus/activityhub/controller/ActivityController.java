package com.campus.activityhub.controller;

import com.campus.activityhub.model.Activity;
import com.campus.activityhub.service.DatabaseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "*")
public class ActivityController {

    @Autowired
    private DatabaseService dbService;

    private ObjectMapper mapper = new ObjectMapper();

    /**
     * GET /api/activities
     */
    @GetMapping
    public ResponseEntity<?> getActivities() {
        try {
            ArrayNode activities = dbService.getArray("activities");
            return ResponseEntity.ok(mapper.convertValue(activities, List.class));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Database error: " + e.getMessage());
        }
    }

    /**
     * GET /api/activities/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getActivityById(@PathVariable String id) {
        try {
            ObjectNode activity = dbService.getObjectById("activities", id);
            if (activity != null) {
                return ResponseEntity.ok(mapper.convertValue(activity, Map.class));
            }
            return ResponseEntity.status(404).body("Activity not found");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Database error: " + e.getMessage());
        }
    }

    /**
     * POST /api/activities
     */
    @PostMapping
    public ResponseEntity<?> createActivity(@RequestBody Map<String, Object> request) {
        try {
            ObjectNode newActivity = mapper.convertValue(request, ObjectNode.class);
            Object capacityValue = request.get("capacity");
            int capacity = capacityValue instanceof Number
                    ? ((Number) capacityValue).intValue()
                    : Integer.parseInt(String.valueOf(capacityValue));

            newActivity.put("id", "act-" + System.currentTimeMillis());
            newActivity.put("capacity", capacity);
            newActivity.put("seatsLeft", capacity);

            dbService.addObject("activities", newActivity);

            return ResponseEntity.ok(mapper.convertValue(newActivity, Map.class));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Database error: " + e.getMessage());
        }
    }

    /**
     * PUT /api/activities/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateActivity(@PathVariable String id, @RequestBody Map<String, Object> request) {
        try {
            ObjectNode updates = mapper.convertValue(request, ObjectNode.class);
            dbService.updateObject("activities", id, updates);
            ObjectNode updated = dbService.getObjectById("activities", id);
            return ResponseEntity.ok(mapper.convertValue(updated, Map.class));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Database error: " + e.getMessage());
        }
    }

    /**
     * DELETE /api/activities/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteActivity(@PathVariable String id) {
        try {
            dbService.deleteObject("activities", id);
            Map<String, Boolean> response = new HashMap<>();
            response.put("ok", true);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Database error: " + e.getMessage());
        }
    }
}
