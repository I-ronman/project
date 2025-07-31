package com.Ironman.back.entity;

import java.util.List;

import com.Ironman.back.dto.FullRoutineDto;
import com.Ironman.back.dto.RoutineExerciseDto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "routine")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutineEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long routineId;

    @Column(nullable = true)
    private String email;  // 이메일이 저장됨
    @Column(nullable = false)
    private String title;
   
    private String summary;
    @Column(nullable = true) // 또는 nullable = false로 하고 직접 값 세팅

 
 //  루틴 + 운동 목록을 DTO로 변환하는 메서드
    public static FullRoutineDto fromEntities(RoutineEntity routine, List<RoutineExerciseEntity> exercises) {
        int totalDuration = exercises.stream()
            .map(RoutineExerciseEntity::getExerciseTime)
            .filter(time -> time != null)
            .mapToInt(Integer::intValue)
            .sum();

        return FullRoutineDto.builder()
                .routineId(routine.getRoutineId())   // ✅ routineId 포함
                .email(routine.getEmail())           // ✅ email 포함
                .title(routine.getTitle())
                .summary(routine.getSummary())
                .exercises(
                    exercises.stream()
                        .map(RoutineExerciseDto::fromEntity)
                        .toList()
                )
                .build();
    }

}