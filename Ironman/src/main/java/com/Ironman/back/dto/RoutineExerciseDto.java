package com.Ironman.back.dto;


import com.Ironman.back.entity.RoutineExerciseEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutineExerciseDto {
    private Long exerciseId;
    private Integer sets;
    private Integer reps;
    private Integer exerciseTime;
    private Integer order;
    
    public static RoutineExerciseDto fromEntity(RoutineExerciseEntity entity) {
        return RoutineExerciseDto.builder()
                .exerciseId(entity.getExercise().getExerciseId())        
                .sets(entity.getSets())
                .reps(entity.getReps())
                .exerciseTime(entity.getExerciseTime())
                .build();
    
 }
}