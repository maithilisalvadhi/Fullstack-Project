package com.campus.activityhub.controller;

import com.campus.activityhub.model.User;
import com.campus.activityhub.service.DatabaseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private DatabaseService dbService;

    private ObjectMapper mapper = new ObjectMapper();

    /**
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            String role = request.get("role");

            ArrayNode users = dbService.getArray("users");

            for (int i = 0; i < users.size(); i++) {
                ObjectNode user = (ObjectNode) users.get(i);
                if (email.equals(user.get("email").asText()) &&
                        password.equals(user.get("password").asText()) &&
                        role.equals(user.get("role").asText())) {

                    Map<String, Object> response = new HashMap<>();
                    response.put("ok", true);
                    response.put("user", mapper.convertValue(user, Map.class));
                    return ResponseEntity.ok(response);
                }
            }

            Map<String, Object> error = new HashMap<>();
            error.put("ok", false);
            error.put("message", "Invalid credentials");
            return ResponseEntity.ok(error);

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Database error: " + e.getMessage());
        }
    }

    /**
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            String email = request.get("email");
            String password = request.get("password");

            ArrayNode users = dbService.getArray("users");

            // Check if email exists
            for (int i = 0; i < users.size(); i++) {
                ObjectNode user = (ObjectNode) users.get(i);
                if (email.equals(user.get("email").asText())) {
                    Map<String, Object> error = new HashMap<>();
                    error.put("ok", false);
                    error.put("message", "Email already registered");
                    return ResponseEntity.ok(error);
                }
            }

            // Create new user
            ObjectNode newUser = mapper.createObjectNode();
            newUser.put("id", "stu-" + System.currentTimeMillis());
            newUser.put("name", name);
            newUser.put("email", email);
            newUser.put("password", password);
            newUser.put("role", "student");
            newUser.put("major", "Undeclared");

            dbService.addObject("users", newUser);

            Map<String, Object> response = new HashMap<>();
            response.put("ok", true);
            response.put("user", mapper.convertValue(newUser, Map.class));
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Database error: " + e.getMessage());
        }
    }
}
