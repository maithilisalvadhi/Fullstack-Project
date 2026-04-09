package com.campus.activityhub.controller;

import com.campus.activityhub.service.DatabaseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private DatabaseService dbService;

    private ObjectMapper mapper = new ObjectMapper();

    /**
     * GET /api/notifications?audience=student|admin
     */
    @GetMapping
    public ResponseEntity<?> getNotifications(@RequestParam String audience) {
        try {
            ArrayNode allNotifications = dbService.getArray("notifications");
            List<Map<String, Object>> filtered = new ArrayList<>();

            for (int i = 0; i < allNotifications.size(); i++) {
                ObjectNode notif = (ObjectNode) allNotifications.get(i);
                if (audience.equals(notif.get("audience").asText())) {
                    filtered.add(mapper.convertValue(notif, Map.class));
                }
            }

            return ResponseEntity.ok(filtered);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Database error: " + e.getMessage());
        }
    }

    /**
     * POST /api/notifications
     */
    @PostMapping
    public ResponseEntity<?> sendNotification(@RequestBody Map<String, String> request) {
        try {
            String title = request.get("title");
            String message = request.get("message");
            String audience = request.get("audience");

            ObjectNode newNotification = mapper.createObjectNode();
            newNotification.put("id", "noti-" + System.currentTimeMillis());
            newNotification.put("title", title);
            newNotification.put("message", message);
            newNotification.put("audience", audience);
            newNotification.put("date", LocalDate.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")));
            newNotification.put("status", "unread");

            dbService.addObject("notifications", newNotification);

            return ResponseEntity.ok(mapper.convertValue(newNotification, Map.class));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Database error: " + e.getMessage());
        }
    }

    /**
     * PATCH /api/notifications/{id}/read
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String id) {
        try {
            ObjectNode updates = mapper.createObjectNode();
            updates.put("status", "read");
            dbService.updateObject("notifications", id, updates);

            Map<String, Boolean> response = new HashMap<>();
            response.put("ok", true);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Database error: " + e.getMessage());
        }
    }
}
