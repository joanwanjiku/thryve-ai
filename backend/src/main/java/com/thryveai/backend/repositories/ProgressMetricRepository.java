package com.thryveai.backend.repositories;

import com.thryveai.backend.entity.MetricType;
import com.thryveai.backend.entity.ProgressMetric;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProgressMetricRepository extends JpaRepository<ProgressMetric, UUID> {

    Page<ProgressMetric> findByUserId(UUID userId, Pageable pageable);

    List<ProgressMetric> findByUserIdAndMetricTypeOrderByRecordedAtDesc(UUID userId, MetricType metricType);

    @Query("SELECT p FROM ProgressMetric p WHERE p.user.id = :userId AND p.recordedAt BETWEEN :start AND :end ORDER BY p.recordedAt DESC")
    List<ProgressMetric> findByUserIdAndRecordedAtBetween(
            @Param("userId") UUID userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT p FROM ProgressMetric p WHERE p.user.id = :userId AND p.metricType = :metricType ORDER BY p.recordedAt DESC LIMIT 1")
    Optional<ProgressMetric> findLatestByUserIdAndMetricType(
            @Param("userId") UUID userId,
            @Param("metricType") MetricType metricType);
}
