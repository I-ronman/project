package com.Ironman.back.dto;

import com.Ironman.back.entity.RoutineExerciseEntity;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutineExerciseDto {

    private Long exerciseId;
    private String exerciseName;       // ✅ 운동 이름
    private String exerciseSummary;    // ✅ 운동 설명

    private Integer sets;
    private Integer reps;
    private Integer exerciseTime;
    private Integer breaktime;
    
    public static RoutineExerciseDto fromEntity(RoutineExerciseEntity entity) {
        return RoutineExerciseDto.builder()
                .exerciseId(entity.getExercise().getExerciseId())
                .exerciseName(entity.getExercise().getExerciseName())           // <- 여기서 DB에서 이름 가져옴
                .exerciseSummary(entity.getExercise().getExerciseSummary())     // <- 여기서 설명 가져옴
                .sets(entity.getSets())
                .reps(entity.getReps())
                .exerciseTime(entity.getExerciseTime())
                .breaktime(entity.getBreaktime())
                .build();
    }
}
