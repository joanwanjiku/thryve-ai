package com.thryveai.backend.services;

import com.thryveai.backend.dto.WorkoutDTO.*;
import com.thryveai.backend.dto.ExerciseDTO.*;

import com.thryveai.backend.entity.Exercise;
import com.thryveai.backend.entity.User;
import com.thryveai.backend.entity.Workout;
import com.thryveai.backend.entity.WorkoutStatus;
import com.thryveai.backend.exception.ResourceNotFoundException;
//import com.thryveai.backend.mapper.WorkoutMapper;
import com.thryveai.backend.mapper.ExerciseMapper;
import com.thryveai.backend.mapper.WorkoutMapper;
import com.thryveai.backend.repositories.UserRepository;
import com.thryveai.backend.repositories.WorkoutRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class WorkoutService {


    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;
    private final WorkoutMapper workoutMapper;
    private final ExerciseMapper exerciseMapper;



    public WorkoutResponse createWorkout(UUID userId, CreateWorkoutRequest createWorkout) {
        log.info("Creating workout for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User",  userId));

        Workout workout = workoutMapper.toEntity(createWorkout);
        workout.setUser(user);

        if (createWorkout.getExercises() != null && !createWorkout.getExercises().isEmpty()) {
            for (int i = 0; i < createWorkout.getExercises().size(); i++) {
                CreateExerciseRequest exerciseRequest = createWorkout.getExercises().get(i);
                Exercise exercise = exerciseMapper.toEntity(exerciseRequest);
                if (exercise.getOrderIndex() == 0) {
                    exercise.setOrderIndex(i);
                }
                workout.addExercise(exercise);
            }

        }

        Workout savedWorkout = workoutRepository.save(workout);
        log.info("Created workout with id: {}", savedWorkout.getId());
        return workoutMapper.toResponse(savedWorkout);

    }

    @Transactional(readOnly = true)
    public Page<WorkoutResponse> getUserWorkouts(UUID userId, Pageable pageable) {
        log.debug("Fetching workouts for user: {}", userId);
        return workoutRepository.findByUserId(userId, pageable)
                .map(workoutMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public WorkoutResponse getWorkoutById(UUID id) {
        Workout workout = workoutRepository.findByIdWithExercises(id);

        if (workout == null) {
            throw new ResourceNotFoundException("Workout", id);
        }
        return workoutMapper.toResponse(workout);
    }
    @Transactional(readOnly = true)
    public List<WorkoutResponse> getWorkoutsByDateRange(UUID userId, LocalDate startDate, LocalDate endDate) {
        log.debug("Fetching workouts for user {} between {} and {}", userId, startDate, endDate);
        return workoutRepository.findByUserIdAndScheduledDateBetween(userId, startDate, endDate)
                .stream()
                .map(workoutMapper::toResponse)
                .collect(Collectors.toList());
    }

    public WorkoutResponse updateWorkout(UUID id, UpdateWorkoutRequest updateWorkout) {
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workout", id));

        workoutMapper.updateEntity(updateWorkout, workout);
        Workout updatedWorkout = workoutRepository.save(workout);
        return workoutMapper.toResponse(updatedWorkout);
    }

    public void deleteWorkout(UUID id) {
        if (!workoutRepository.existsById(id)) {
            throw new ResourceNotFoundException("Workout", id);
        }
        workoutRepository.deleteById(id);
    }

    public WorkoutResponse completeWorkout(UUID id, Integer caloriesBurned) {
        log.info("Completing workout: {}", id);
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workout", id));

        workout.setStatus(WorkoutStatus.COMPLETED);
        if (caloriesBurned != null) {
            workout.setCaloriesBurned(caloriesBurned);
        }
//        TODO: Add logic to calculate caloriesBurned
        Workout updatedWorkout = workoutRepository.save(workout);
        log.info("Completed workout: {}", id);
        return workoutMapper.toResponse(updatedWorkout);
    }

    public long countCompletedWorkouts(UUID userId) {
        return workoutRepository.countByUserIdAndStatus(userId, WorkoutStatus.COMPLETED);
    }
}
