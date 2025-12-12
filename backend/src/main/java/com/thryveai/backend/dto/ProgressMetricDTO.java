package com.thryveai.backend.dto;

import com.thryveai.backend.entity.MetricType;
import com.thryveai.backend.entity.WorkoutStatus;
import com.thryveai.backend.entity.WorkoutType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class ProgressMetricDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateProgressMetricRequest {
        @NotNull(message = "Metric type is required")
        private MetricType metricType;

        @NotNull(message = "Value is required")
        @DecimalMin(value = "0.0", message = "Value must be positive")
        private BigDecimal value;

        private String unit;

        private LocalDateTime recordedAt;

        private String notes;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ProgressMetricResponse {
        private UUID id;
        private MetricType metricType;
        private BigDecimal value;
        private String unit;
        private LocalDateTime recordedAt;
        private String notes;
    }

}
