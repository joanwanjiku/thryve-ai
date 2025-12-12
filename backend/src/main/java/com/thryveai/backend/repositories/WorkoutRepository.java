package com.thryveai.backend.repositories;

import com.thryveai.backend.entity.Workout;
import com.thryveai.backend.entity.WorkoutStatus;
import com.thryveai.backend.entity.WorkoutType;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
@Repository
public interface WorkoutRepository extends JpaRepository<Workout, UUID> {

    Page<Workout> findByUserId(UUID userId, Pageable pageable);
    List<Workout> findByUserIdAndScheduledDateBetween(UUID userId, LocalDate start, LocalDate end);
    List<Workout> findByUserIdAndStatus(UUID userId, WorkoutStatus status);

    List<Workout> findByUserIdAndWorkoutType(UUID userId, WorkoutType workoutType);

    @Query("SELECT w from Workout w LEFT JOIN FETCH w.exercises WHERE w.id = :id")
    Workout findByIdWithExercises(@Param("id") UUID id);

    @Query("SELECT w FROM Workout w LEFT JOIN FETCH w.exercises WHERE w.user.id = :userId ORDER BY w.scheduledDate DESC")
    List<Workout> findByUserIdWithExercises(@Param("userId") UUID userId);
    @Query("SELECT COUNT(w) FROM Workout w WHERE w.user.id = :userId AND w.status = :status")
    long countByUserIdAndStatus(@Param("userId") UUID userId, @Param("status") WorkoutStatus status);

    @Query("SELECT w FROM Workout w WHERE w.user.id = :userId AND w.scheduledDate = :date")
    List<Workout> findByUserIdAndScheduledDate(@Param("userId") UUID userId, @Param("date") LocalDate date);

    @Query("SELECT SUM(w.durationMinutes) FROM Workout w WHERE w.user.id = :userId AND w.status = 'COMPLETED' AND w.scheduledDate BETWEEN :startDate AND :endDate")
    Integer getTotalMinutesByUserIdAndDateRange(
            @Param("userId") UUID userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
