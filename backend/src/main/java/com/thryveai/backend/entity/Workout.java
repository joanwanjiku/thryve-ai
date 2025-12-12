package com.thryveai.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workouts")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Workout extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "workout_type")
    private WorkoutType workoutType;

    @Column(name = "scheduled_date")
    private LocalDate scheduledDate;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "calories_burned")
    private Integer caloriesBurned;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private WorkoutStatus status = WorkoutStatus.PLANNED;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "workout", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    @Builder.Default
    private List<Exercise> exercises = new ArrayList<>();

    public void addExercise(Exercise exercise) {
        exercises.add(exercise);
    }
    public void removeExercise(Exercise exercise) {
        exercises.remove(exercise);
    }
}
