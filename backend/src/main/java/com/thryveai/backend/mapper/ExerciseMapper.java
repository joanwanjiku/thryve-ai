package com.thryveai.backend.mapper;

import com.thryveai.backend.dto.ExerciseDTO;
import com.thryveai.backend.entity.Exercise;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ExerciseMapper {

    @Mapping(target = "orderIndex", defaultValue = "0")
    @Mapping(target = "restSeconds", defaultValue = "60")
    Exercise toEntity(ExerciseDTO.CreateExerciseRequest ex);
}
