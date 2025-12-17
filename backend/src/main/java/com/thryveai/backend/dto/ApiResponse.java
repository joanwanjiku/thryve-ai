//package com.thryveai.backend.dto;
//
//
//import com.fasterxml.jackson.annotation.JsonInclude;
//import lombok.*;
//
//
//import java.time.LocalDateTime;
//
//@Data
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//@JsonInclude(JsonInclude.Include.NON_NULL)
//public class ApiResponse<T> {
//
//    private boolean success;
//    private int statusCode;
//    private String message;
//    private T data;
//
//    @Builder.Default
//    private LocalDateTime timestamp = LocalDateTime.now();
//
//    public static <T> ApiResponse<T> success(T data) {
//        return ApiResponse.<T>builder()
//                .success(true)
//                .statusCode(200)
//                .data(data)
//                .build();
//    }
//    public static <T> ApiResponse<T> success(T data, String message) {
//        return ApiResponse.<T>builder()
//                .success(true)
//                .statusCode(200)
//                .message(message)
//                .data(data)
//                .build();
//    }
//    public static <T> ApiResponse<T> created(T data) {
//        return ApiResponse.<T>builder()
//                .success(true)
//                .statusCode(201)
//                .message("Created Successfully")
//                .data(data)
//                .build();
//    }
//    public static <T> ApiResponse<T> error(int statusCode, String message) {
//        return ApiResponse.<T>builder()
//                .success(false)
//                .statusCode(statusCode)
//                .message(message)
//                .build();
//    }
//    public static <T> ApiResponse<T> error(int statusCode, String message, T data) {
//        return ApiResponse.<T>builder()
//                .success(false)
//                .statusCode(statusCode)
//                .message(message)
//                .data(data)
//                .build();
//    }
//    public static ApiResponse<Void> noContent() {
//        return ApiResponse.<Void>builder()
//                .success(true)
//                .statusCode(204)
//                .message("No content")
//                .build();
//    }
//
//}
