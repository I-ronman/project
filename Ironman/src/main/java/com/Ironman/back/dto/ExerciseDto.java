package com.Ironman.back.dto;

import com.Ironman.back.entity.ExerciseEntity;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseDto {
    private Long exerciseId;
    private String exerciseName;
    private Integer expectedCalorie;

    public static ExerciseDto fromEntity(ExerciseEntity entity) {
        return ExerciseDto.builder()
                .exerciseId(entity.getExerciseId())
                .exerciseName(entity.getExerciseName())
                .expectedCalorie(entity.getExpectedCalorie())
                .build();
    }

    public ExerciseEntity toEntity() {
        return ExerciseEntity.builder()
                .exerciseId(exerciseId)
                .exerciseName(exerciseName)
                .expectedCalorie(expectedCalorie)
                .build();
    }
}
