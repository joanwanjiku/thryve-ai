package com.thryveai.backend.dto;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class APIResponse<T> {

    private boolean success;
    private int statusCode;
    private String message;
    private T data;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    public static <T> APIResponse<T> success(T data) {
        return APIResponse.<T>builder()
                .success(true)
                .statusCode(200)
                .message("Success")
                .data(data)
                .build();
    }

    public static <T> APIResponse<T> created(T data) {
        return APIResponse.<T>builder()
                .success(true)
                .statusCode(201)
                .message("Created")
                .data(data)
                .build();
    }
    public static <T> APIResponse<T> error(int statusCode, String message) {
        return APIResponse.<T>builder()
                .success(false)
                .statusCode(statusCode)
                .message(message)
                .build();
    }

}
