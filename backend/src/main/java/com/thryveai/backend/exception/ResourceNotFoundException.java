package com.thryveai.backend.exception;

import java.util.UUID;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
    public ResourceNotFoundException(String resourceName, UUID id) {
        super(String.format("%s not found with id: %s", resourceName, id));
    }

    public ResourceNotFoundException(String resourceName, String fieldName, String fieldValue) {
        super(String.format("%s not found with %s: %s", resourceName, fieldName, fieldValue));
    }
}

