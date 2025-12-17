package com.thryveai.backend.controllers;


import com.thryveai.backend.dto.ApiResponse;
import com.thryveai.backend.dto.WorkoutDTO;
import com.thryveai.backend.dto.WorkoutDTO.WorkoutResponse;
import com.thryveai.backend.dto.WorkoutDTO.CreateWorkoutRequest;

import com.thryveai.backend.services.WorkoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workouts")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutService workoutService;

    @GetMapping("/v1")
    public String home() {
        return ("Hello World");
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WorkoutResponse>> createWorkout(
            @RequestHeader("X-User-Id") UUID userId,
            @Valid @RequestBody CreateWorkoutRequest request
    ) {
        WorkoutResponse response = workoutService.createWorkout(userId, request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.created(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<WorkoutResponse>>> getUserWorkouts(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "scheduledDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir
            ){
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<WorkoutResponse> workouts = workoutService.getUserWorkouts(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(workouts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkoutResponse>> getWorkoutById(
            @PathVariable UUID id
    ) {
        WorkoutResponse response = workoutService.getWorkoutById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/range")
    public ResponseEntity<ApiResponse<List<WorkoutResponse>>> getWorkoutsByDateRange(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<WorkoutResponse> workouts = workoutService.getWorkoutsByDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(workouts));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkoutResponse>> updateWorkout(
            @PathVariable UUID id,
            @Valid @RequestBody WorkoutDTO.UpdateWorkoutRequest request
    ) {
        WorkoutResponse response = workoutService.updateWorkout(id, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    @PostMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<WorkoutResponse>> completeWorkout(
            @PathVariable UUID id,
            @RequestParam(required = false) Integer caloriesBurned
    ){
        WorkoutResponse response = workoutService.completeWorkout(id, caloriesBurned);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable UUID id) {
        workoutService.deleteWorkout(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats/completed")
    public ResponseEntity<ApiResponse<Long>> getCompletedWorkoutsCount(
            @RequestHeader("X-User-Id") UUID userId) {
        long count = workoutService.countCompletedWorkouts(userId);
        return ResponseEntity.ok(ApiResponse.success(count));
    }

}
