package com.thryveai.backend.services;

import com.thryveai.backend.dto.WorkoutDTO.*;
import com.thryveai.backend.entity.Exercise;
import com.thryveai.backend.entity.User;
import com.thryveai.backend.entity.Workout;
import com.thryveai.backend.exception.ResourceNotFoundException;
import com.thryveai.backend.mapper.WorkoutMapper;
import com.thryveai.backend.repositories.UserRepository;
import com.thryveai.backend.repositories.WorkoutRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class WorkoutService {


    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;
    private final WorkoutMapper workoutMapper;

    public WorkoutResponse createWorkout(UUID userId, CreateWorkoutRequest createWorkout) {
        log.info("Creating workout for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User",  userId));

        Workout workout = workoutMapper.toEntity(createWorkout);
        workout.setUser(user);

        if (createWorkout.getExercises() != null) {
            createWorkout.getExercises().forEach(ex -> {
                Exercise exercise = workoutMapper.toEntity(ex);
                workout.addExercise(exercise);
            });
        }

        Workout savedWorkout = workoutRepository.save(workout);
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

    public WorkoutResponse updateWorkout(UUID id, UpdateWorkoutRequest updateWorkout) {
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workout", id));

        workoutMapper.updateEntity(workout, updateWorkout);
        Workout updatedWorkout = workoutRepository.save(workout);
        return workoutMapper.toResponse(updatedWorkout);
    }

    public void deleteWorkout(UUID id) {
        if (!workoutRepository.existsById(id)) {
            throw new ResourceNotFoundException("Workout", id);
        }
        workoutRepository.deleteById(id);
    }

}
