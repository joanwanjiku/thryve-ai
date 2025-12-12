package com.thryveai.backend.mapper;

import com.thryveai.backend.dto.ExerciseDTO;
import com.thryveai.backend.dto.WorkoutDTO.*;
import com.thryveai.backend.dto.ExerciseDTO.*;


import com.thryveai.backend.entity.Exercise;
import com.thryveai.backend.entity.Workout;
import org.springframework.stereotype.Component;
//import java.util.stream.Collectors;

@Component
public class WorkoutMapper {
    public Workout toEntity(CreateWorkoutRequest request) {
        return Workout.builder()
                .name(request.getName())
                .description(request.getDescription())
                .workoutType(request.getWorkoutType())
                .scheduledDate(request.getScheduledDate())
                .durationMinutes(request.getDurationMinutes())
                .notes(request.getNotes())
                .build();
    }
    public Exercise toEntity(CreateExerciseRequest request) {
        return Exercise.builder()
                .name(request.getName())
                .exerciseType(request.getExerciseType())
                .sets(request.getSets())
                .reps(request.getReps())
                .weightKg(request.getWeightKg())
                .durationSeconds(request.getDurationSeconds())
                .distanceMeters(request.getDistanceMeters())
                .restSeconds(request.getRestSeconds() != null ? request.getRestSeconds() : 60)
                .orderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : 0)
                .notes(request.getNotes())
                .build();
    }

    public void updateEntity(Workout workout, UpdateWorkoutRequest request) {
        if (request.getName() != null) {
            workout.setName(request.getName());
        }
        if (request.getDescription() != null) {
            workout.setDescription(request.getDescription());
        }
        if (request.getWorkoutType() != null) {
            workout.setWorkoutType(request.getWorkoutType());
        }
        if (request.getScheduledDate() != null) {
            workout.setScheduledDate(request.getScheduledDate());
        }
        if (request.getDurationMinutes() != null) {
            workout.setDurationMinutes(request.getDurationMinutes());
        }
        if (request.getCaloriesBurned() != null) {
            workout.setCaloriesBurned(request.getCaloriesBurned());
        }
        if (request.getStatus() != null) {
            workout.setStatus(request.getStatus());
        }
        if (request.getNotes() != null) {
            workout.setNotes(request.getNotes());
        }
    }

    public WorkoutResponse toResponse(Workout savedWorkout) {
        return WorkoutResponse.builder()
                .id(savedWorkout.getId())
                .name(savedWorkout.getName())
                .description(savedWorkout.getDescription())
                .workoutType(savedWorkout.getWorkoutType())
                .scheduledDate(savedWorkout.getScheduledDate())
                .durationMinutes(savedWorkout.getDurationMinutes())
                .caloriesBurned(savedWorkout.getCaloriesBurned())
                .status(savedWorkout.getStatus())
                .notes(savedWorkout.getNotes())
                .createdAt(savedWorkout.getCreatedAt())
                .updatedAt(savedWorkout.getUpdatedAt())
                .build();
    }
    public ExerciseDTO.ExerciseResponse toResponse(Exercise exercise) {
        return ExerciseDTO.ExerciseResponse.builder()
                .id(exercise.getId())
                .name(exercise.getName())
                .exerciseType(exercise.getExerciseType())
                .sets(exercise.getSets())
                .reps(exercise.getReps())
                .weightKg(exercise.getWeightKg())
                .durationSeconds(exercise.getDurationSeconds())
                .distanceMeters(exercise.getDistanceMeters())
                .restSeconds(exercise.getRestSeconds())
                .orderIndex(exercise.getOrderIndex())
                .notes(exercise.getNotes())
                .build();
    }
}
