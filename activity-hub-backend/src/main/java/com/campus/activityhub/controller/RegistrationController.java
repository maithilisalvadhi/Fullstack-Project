package com.campus.activityhub.controller;

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
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "*")
public class RegistrationController {

    @Autowired
    private DatabaseService dbService;

    private ObjectMapper mapper = new ObjectMapper();

    /**
     * GET /api/registrations
     */
    @GetMapping
    public ResponseEntity<?> getRegistrations() {
        try {
            ArrayNode registrations = dbService.getArray("registrations");
            return ResponseEntity.ok(mapper.convertValue(registrations, List.class));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Database error: " + e.getMessage());
        }
    }

    /**
     * POST /api/registrations
     */
    @PostMapping
    public ResponseEntity<?> registerForActivity(@RequestBody Map<String, String> request) {
        try {
            String activityId = request.get("activityId");
            String student = request.get("student");

            // Create new registration
            ObjectNode newRegistration = mapper.createObjectNode();
            newRegistration.put("id", "reg-" + System.currentTimeMillis());
            newRegistration.put("activityId", activityId);
            newRegistration.put("student", student);
            newRegistration.put("status", "Confirmed");

            dbService.addObject("registrations", newRegistration);

            // Update activity seats
            ObjectNode activity = dbService.getObjectById("activities", activityId);
            if (activity != null) {
                int seatsLeft = activity.get("seatsLeft").asInt();
                ObjectNode updates = mapper.createObjectNode();
                updates.put("seatsLeft", Math.max(seatsLeft - 1, 0));
                dbService.updateObject("activities", activityId, updates);
            }

            return ResponseEntity.ok(mapper.convertValue(newRegistration, Map.class));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Database error: " + e.getMessage());
        }
    }

    /**
     * DELETE /api/registrations/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelRegistration(@PathVariable String id) {
        try {
            // Get registration to get activityId
            ObjectNode registration = dbService.getObjectById("registrations", id);
            if (registration != null) {
                String activityId = registration.get("activityId").asText();

                // Delete registration
                dbService.deleteObject("registrations", id);

                // Update activity seats (increment)
                ObjectNode activity = dbService.getObjectById("activities", activityId);
                if (activity != null) {
                    int seatsLeft = activity.get("seatsLeft").asInt();
                    ObjectNode updates = mapper.createObjectNode();
                    updates.put("seatsLeft", seatsLeft + 1);
                    dbService.updateObject("activities", activityId, updates);
                }
            }

            Map<String, Boolean> response = new HashMap<>();
            response.put("ok", true);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Database error: " + e.getMessage());
        }
    }
}
