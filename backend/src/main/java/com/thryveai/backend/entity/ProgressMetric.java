package com.thryveai.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "progress_metrics")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ProgressMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "metric_type", nullable = false)
    private MetricType metricType;

    @Column(nullable = false)
    private BigDecimal value;

    private String unit;

    @Column(name = "recorded_at")
    @Builder.Default
    private LocalDateTime recordedAt = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String notes;
}

