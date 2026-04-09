package com.campus.activityhub.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class DatabaseService {
    private static final List<String> DEFAULT_KEYS = Arrays.asList(
            "users",
            "activities",
            "registrations",
            "notifications");

    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper mapper;

    public DatabaseService(JdbcTemplate jdbcTemplate, ObjectMapper mapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.mapper = mapper;
    }

    /**
     * Read the entire database document from MySQL.
     */
    public JsonNode readDatabase() throws IOException {
        ObjectNode root = mapper.createObjectNode();

        List<java.util.Map<String, Object>> rows = jdbcTemplate.queryForList("SELECT db_key, payload FROM app_data");
        for (java.util.Map<String, Object> row : rows) {
            String key = String.valueOf(row.get("db_key"));
            String payload = row.get("payload") == null ? null : String.valueOf(row.get("payload"));
            JsonNode value = payload == null || payload.isBlank()
                    ? mapper.createArrayNode()
                    : mapper.readTree(payload);
            root.set(key, value);
        }

        for (String key : DEFAULT_KEYS) {
            if (!root.has(key)) {
                root.set(key, mapper.createArrayNode());
            }
        }

        return root;
    }

    /**
     * Write the full database document back to MySQL.
     */
    public void writeDatabase(JsonNode data) throws IOException {
        if (data == null || !data.isObject()) {
            throw new IOException("Database payload must be a JSON object");
        }

        Set<String> keysToPersist = new LinkedHashSet<>(DEFAULT_KEYS);
        data.fieldNames().forEachRemaining(keysToPersist::add);

        for (String key : keysToPersist) {
            JsonNode value = data.get(key);
            if (value == null) {
                value = mapper.createArrayNode();
            }
            upsertSection(key, value);
        }
    }

    /**
     * Get array from a key (e.g., "activities", "users")
     */
    public ArrayNode getArray(String key) throws IOException {
        JsonNode db = readDatabase();
        JsonNode node = db.get(key);
        if (node == null || !node.isArray()) {
            return mapper.createArrayNode();
        }
        return (ArrayNode) node;
    }

    /**
     * Get single object by id from array
     */
    public ObjectNode getObjectById(String key, String id) throws IOException {
        ArrayNode array = getArray(key);
        for (int i = 0; i < array.size(); i++) {
            ObjectNode obj = (ObjectNode) array.get(i);
            if (id.equals(obj.get("id").asText())) {
                return obj;
            }
        }
        return null;
    }

    /**
     * Add object to array
     */
    public void addObject(String key, ObjectNode obj) throws IOException {
        JsonNode db = readDatabase();
        ArrayNode array = (ArrayNode) db.get(key);
        if (array == null) {
            array = mapper.createArrayNode();
            ((ObjectNode) db).set(key, array);
        }
        array.add(obj);
        writeDatabase(db);
    }

    /**
     * Update object in array
     */
    public void updateObject(String key, String id, ObjectNode updates) throws IOException {
        JsonNode db = readDatabase();
        ArrayNode array = (ArrayNode) db.get(key);
        if (array != null) {
            for (int i = 0; i < array.size(); i++) {
                ObjectNode obj = (ObjectNode) array.get(i);
                if (id.equals(obj.get("id").asText())) {
                    updates.fields().forEachRemaining(entry -> obj.set(entry.getKey(), entry.getValue()));
                    writeDatabase(db);
                    return;
                }
            }
        }
    }

    /**
     * Delete object from array
     */
    public void deleteObject(String key, String id) throws IOException {
        JsonNode db = readDatabase();
        ArrayNode array = (ArrayNode) db.get(key);
        if (array != null) {
            for (int i = 0; i < array.size(); i++) {
                ObjectNode obj = (ObjectNode) array.get(i);
                if (id.equals(obj.get("id").asText())) {
                    array.remove(i);
                    writeDatabase(db);
                    return;
                }
            }
        }
    }

    /**
     * Convert array to list of objects (for JSON serialization)
     */
    public List<ObjectNode> arrayToList(ArrayNode array) {
        List<ObjectNode> list = new ArrayList<>();
        for (int i = 0; i < array.size(); i++) {
            list.add((ObjectNode) array.get(i));
        }
        return list;
    }

    private void upsertSection(String key, JsonNode value) throws IOException {
        String payload = mapper.writeValueAsString(value);
        jdbcTemplate.update(
                "INSERT INTO app_data (db_key, payload) VALUES (?, ?) ON DUPLICATE KEY UPDATE payload = ?",
                key,
                payload,
                payload);
    }
}
