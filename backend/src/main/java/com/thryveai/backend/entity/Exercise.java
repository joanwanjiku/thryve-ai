package com.thryveai.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.*;

@Entity
@Builder
@Table(name = "exercises")
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
public class Exercise extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_id", nullable = false)
    private Workout workout;

    @Column(nullable = false, length = 100)
    private String name;

    private int sets;

    private int reps;

    @Column(name = "weight_kg")
    private BigDecimal weightKg;

    @Column(name = "duration_seconds")
    private int durationSeconds;

    @Column(name = "exercise_type")
    private ExerciseType exerciseType;

    @Column(name = "distance_meters")
    private BigDecimal distanceMeters;

    @Column(name = "rest_seconds")
    @Builder.Default
    private Integer restSeconds = 60;

    @Column(name = "order_index")
    @Builder.Default
    private Integer orderIndex = 0;

    @Column(columnDefinition = "TEXT")
    private String notes;

}
