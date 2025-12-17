package com.thryveai.backend.repositories;

import com.thryveai.backend.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, UUID> {
    List<Exercise> findByWorkoutIdOrderByOrderIndexAsc(UUID workoutId);
    void deleteByWorkoutId(UUID workoutId);

}
