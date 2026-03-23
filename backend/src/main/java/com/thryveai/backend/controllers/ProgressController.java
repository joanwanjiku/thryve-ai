package com.thryveai.backend.controllers;

import com.thryveai.backend.dto.ApiResponse;
import com.thryveai.backend.dto.ProgressMetricDTO.ProgressMetricResponse;
import com.thryveai.backend.dto.ProgressMetricDTO.CreateProgressMetricRequest;
import com.thryveai.backend.entity.MetricType;
import com.thryveai.backend.services.ProgressService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/progress")
@RequiredArgsConstructor
public class ProgressController {
    private final ProgressService progressService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProgressMetricResponse>> createProgressMetric(
//            @RequestHeader ("X-User-Id") UUID userId,
            Authentication authentication,
            @Valid @RequestBody CreateProgressMetricRequest request
    ) {
        UUID userId = (UUID) authentication.getPrincipal();
        ProgressMetricResponse response = progressService.recordProgress(userId, request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.created(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProgressMetricResponse>>> getUserProgressMetrics(
//            @RequestHeader ("X-User-Id") UUID userId,
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        UUID userId = (UUID) authentication.getPrincipal();
        Pageable pageable = PageRequest.of(page, size);
        Page<ProgressMetricResponse> metrics = progressService.getUserProgress(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(metrics));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<ProgressMetricResponse>>> getProgressMetricByType(
//            @RequestHeader ("X-User-Id") UUID userId,
            Authentication authentication,
            @PathVariable String type
    ){
        UUID userId = (UUID) authentication.getPrincipal();

        List<ProgressMetricResponse> response = progressService.getProgressByType(userId, MetricType.valueOf(type));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/latest/{type}")
    public ResponseEntity<ApiResponse<ProgressMetricResponse>> getLatestProgressMetricByType(
//            @RequestHeader ("X-User-Id") UUID userId,
            Authentication authentication,
            @PathVariable String type
    ){
        UUID userId = (UUID) authentication.getPrincipal();

        ProgressMetricResponse response = progressService.getLatestMetric(userId, MetricType.valueOf(type));
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgressMetric(
            @PathVariable UUID id
    ){
        progressService.deleteProgress(id);
        return ResponseEntity.ok().build();
    }



}
