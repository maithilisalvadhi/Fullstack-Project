package com.campus.activityhub.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class DatabaseService {
    private final ObjectMapper mapper = new ObjectMapper();
    private final String dbFilePath = "db.json";

    /**
     * Read the entire db.json file
     */
    public JsonNode readDatabase() throws IOException {
        File file = new File(dbFilePath);
        if (!file.exists()) {
            throw new IOException("db.json not found");
        }
        return mapper.readTree(file);
    }

    /**
     * Write entire db.json file
     */
    public void writeDatabase(JsonNode data) throws IOException {
        mapper.writerWithDefaultPrettyPrinter().writeValue(new File(dbFilePath), data);
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
}
