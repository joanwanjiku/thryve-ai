package com.thryveai.backend.dto;

import com.thryveai.backend.entity.Exercise;
import com.thryveai.backend.entity.ExerciseType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;
import java.math.BigDecimal;

public class ExerciseDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateExerciseRequest {
        @NotBlank(message = "Exercise name is required")
        private String name;
        private ExerciseType exerciseType;
        @Min(1)
        private Integer sets;
        @Min(1)
        private Integer reps;
        @DecimalMin("0.0")
        private BigDecimal weightKg;
        @Min(0)
        private Integer durationSeconds;
        @DecimalMin("0.0")
        private BigDecimal distanceMeters;
        private Integer restSeconds;
        private Integer orderIndex;
        private String notes;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ExerciseResponse {
        private UUID id;
        private String name;
        private ExerciseType exerciseType;
        private Integer sets;
        private Integer reps;
        private BigDecimal weightKg;
        private Integer durationSeconds;
        private BigDecimal distanceMeters;
        private Integer restSeconds;
        private Integer orderIndex;
        private String notes;
    }

}
