package com.thryveai.backend.services;


import com.thryveai.backend.dto.ProgressMetricDTO.ProgressMetricResponse;
import com.thryveai.backend.dto.ProgressMetricDTO.CreateProgressMetricRequest;
import com.thryveai.backend.entity.MetricType;
import com.thryveai.backend.entity.ProgressMetric;
import com.thryveai.backend.entity.User;
import com.thryveai.backend.exception.ResourceNotFoundException;
import com.thryveai.backend.repositories.ProgressMetricRepository;
import com.thryveai.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class ProgressService {
    private final ProgressMetricRepository progressMetricRepository;
    private final UserRepository userRepository;

    public ProgressMetricResponse recordProgress(UUID userId, CreateProgressMetricRequest request) {
        log.info("Recording progress metric for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        ProgressMetric metric = ProgressMetric.builder()
                .user(user)
                .metricType(request.getMetricType())
                .value(request.getValue())
                .unit(request.getUnit())
                .recordedAt(request.getRecordedAt() != null ? request.getRecordedAt() : LocalDateTime.now())
                .notes(request.getNotes())
                .build();

        ProgressMetric savedMetric = progressMetricRepository.save(metric);
        log.info("Recorded progress metric with id: {}", savedMetric.getId());
        return toResponse(savedMetric);
    }
    @Transactional(readOnly = true)
    public Page<ProgressMetricResponse> getUserProgress(UUID userId, Pageable pageable) {
        log.debug("Fetching progress metrics for user: {}", userId);
        return progressMetricRepository.findByUserId(userId, pageable)
                .map(this::toResponse);
    }
    @Transactional(readOnly = true)
    public List<ProgressMetricResponse> getProgressByType(UUID userId, MetricType metricType) {
        log.debug("Fetching {} metrics for user: {}", metricType, userId);
        return progressMetricRepository.findByUserIdAndMetricTypeOrderByRecordedAtDesc(userId, metricType)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProgressMetricResponse> getProgressByDateRange(UUID userId, LocalDateTime startDate, LocalDateTime endDate) {
        log.debug("Fetching progress for user {} between {} and {}", userId, startDate, endDate);
        return progressMetricRepository.findByUserIdAndRecordedAtBetween(userId, startDate, endDate)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public ProgressMetricResponse getLatestMetric(UUID userId, MetricType metricType) {
        log.debug("Fetching latest {} for user: {}", metricType, userId);
        return progressMetricRepository.findLatestByUserIdAndMetricType(userId, metricType)
                .map(this::toResponse)
                .orElse(null);
    }
    public void deleteProgress(UUID id) {
        log.info("Deleting progress metric: {}", id);
        if (!progressMetricRepository.existsById(id)) {
            throw new ResourceNotFoundException("ProgressMetric", id);
        }
        progressMetricRepository.deleteById(id);
        log.info("Deleted progress metric: {}", id);
    }

    private ProgressMetricResponse toResponse(ProgressMetric metric) {
        return ProgressMetricResponse.builder()
                .id(metric.getId())
                .metricType(metric.getMetricType())
                .value(metric.getValue())
                .unit(metric.getUnit())
                .recordedAt(metric.getRecordedAt())
                .notes(metric.getNotes())
                .build();
    }
}
