package com.thryveai.backend.dto;

import com.thryveai.backend.entity.WorkoutStatus;
import com.thryveai.backend.entity.WorkoutType;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


public class WorkoutDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateWorkoutRequest{
        @NotBlank(message = "Workout name is required")
        @Size(min = 3, max = 100, message = "Workout name must be between 3 and 100 characters")
        private String name;
        private String description;
        private WorkoutType workoutType;
        private LocalDate scheduledDate;
        private Integer durationMinutes;
        private Integer caloriesBurned;
        private String notes;
        private List<ExerciseDTO.CreateExerciseRequest> exercises;
    }
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateWorkoutRequest {
        @Size(max = 100, message = "Name cannot exceed 100 characters")
        private String name;
        private String description;
        private WorkoutType workoutType;
        private LocalDate scheduledDate;
        private Integer durationMinutes;
        private Integer caloriesBurned;
        private WorkoutStatus status;
        private String notes;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class WorkoutResponse {
        private UUID id;
        private String name;
        private String description;
        private WorkoutType workoutType;
        private LocalDate scheduledDate;
        private Integer durationMinutes;
        private Integer caloriesBurned;
        private WorkoutStatus status;
        private String notes;
        private List<ExerciseDTO.ExerciseResponse> exercises;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WorkoutSummary {
        private UUID id;
        private String name;
        private WorkoutType workoutType;
        private LocalDate scheduledDate;
        private Integer durationMinutes;
        private WorkoutStatus status;
        private int exerciseCount;
    }
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private UUID id;
        private String name;
        private String description;
        private WorkoutType workoutType;
        private LocalDate scheduledDate;
        private Integer durationMinutes;
        private Integer caloriesBurned;
        private WorkoutStatus status;
        private String notes;
        private List<ExerciseDTO.ExerciseResponse> exercises;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }


}
