package com.thryveai.backend.mapper;

import com.thryveai.backend.dto.WorkoutDTO;
import com.thryveai.backend.entity.Workout;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)

public interface WorkoutMapper {
    Workout toEntity(WorkoutDTO.CreateWorkoutRequest dto);

    WorkoutDTO.WorkoutResponse toResponse(Workout workout);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(WorkoutDTO.UpdateWorkoutRequest dto, @MappingTarget Workout entity);

}
