package com.Ironman.back.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Ironman.back.dto.FullRoutineDto;
import com.Ironman.back.dto.RoutineExerciseDto;
import com.Ironman.back.entity.ExerciseEntity;
import com.Ironman.back.entity.RoutineEntity;
import com.Ironman.back.entity.RoutineExerciseEntity;
import com.Ironman.back.repo.RoutineRepository;
import com.Ironman.back.repo.ExerciseRepository;
import com.Ironman.back.repo.RoutineExerciseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoutineService {

    private final RoutineRepository routineRepository;
    private final RoutineExerciseRepository routineExerciseRepository;
    private final ExerciseRepository exerciseRepository;

     // 루틴 저장 및 수정
    @Transactional
    public void saveOrUpdateFullRoutine(FullRoutineDto dto, String email) {
        RoutineEntity routine;

        // ✅ 1. 수정 로직
        if (dto.getRoutineId() != null) {
            routine = routineRepository.findById(dto.getRoutineId())
                .orElseThrow(() -> new IllegalArgumentException("해당 루틴이 존재하지 않습니다."));

            if (!routine.getEmail().equals(email)) {
                throw new SecurityException("본인의 루틴만 수정할 수 있습니다.");
            }

            routine.setTitle(dto.getTitle());
            routine.setSummary(dto.getSummary());

            // 루틴 정보 업데이트
            routineRepository.save(routine);

            // 기존 운동 목록 삭제
            routineExerciseRepository.deleteByRoutine(routine);

        } else {
            //  2. 신규 저장
            routine = RoutineEntity.builder()
                .email(email)
                .title(dto.getTitle())
                .summary(dto.getSummary())
                .build();

            routineRepository.save(routine);
        }

        //  3. 운동 항목 재등록 (공통)
        List<RoutineExerciseEntity> exerciseEntities = dto.getExercises().stream()
            .map(exDto -> {
                if (exDto.getExerciseId() == null) {
                    throw new IllegalArgumentException("운동 ID는 필수입니다.");
                }

                ExerciseEntity exercise = exerciseRepository.findById(exDto.getExerciseId())
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 운동 ID: " + exDto.getExerciseId()));

                return RoutineExerciseEntity.builder()
                    .routine(routine)
                    .exercise(exercise)
                    .sets(exDto.getSets())
                    .reps(exDto.getReps())
                    .exerciseTime(exDto.getExerciseTime())
                    .breaktime(exDto.getBreaktime())
                    .build();
            })
            .collect(Collectors.toList());

        routineExerciseRepository.saveAll(exerciseEntities);
    }

    // 루틴 삭제
    @Transactional
    public void deleteRoutine(Long routineId, String userEmail) {
        RoutineEntity routine = routineRepository.findById(routineId)
            .orElseThrow(() -> new RuntimeException("루틴이 존재하지 않습니다."));

        if (!routine.getEmail().equals(userEmail)) {
            throw new RuntimeException("본인의 루틴만 삭제할 수 있습니다.");
        }

        routineExerciseRepository.deleteByRoutine(routine);
        routineRepository.delete(routine);
    }

    @Transactional(readOnly = true)
    public List<FullRoutineDto> getRoutinesByUser(String email) {
        List<RoutineEntity> routines = routineRepository.findByEmail(email);

        return routines.stream()
            .map(routine -> {
                List<RoutineExerciseEntity> exercises = routineExerciseRepository.findByRoutine(routine);

                int totalExerciseTime = exercises.stream()
                    .mapToInt(e -> {
                        int sets = e.getSets() != null ? e.getSets() : 1;
                        int reps = e.getReps() != null ? e.getReps() : 1;
                        int time = e.getExerciseTime() != null ? e.getExerciseTime() : 1;
                        return sets * reps * time;
                    })
                    .sum();

                return FullRoutineDto.builder()
                    .routineId(routine.getRoutineId())
                    .title(routine.getTitle())
                    .summary(routine.getSummary())
                    .email(routine.getEmail())
                    .exerciseTime(totalExerciseTime)
                    .exercises(
                        exercises.stream()
                            .map(RoutineExerciseDto::fromEntity)
                            .collect(Collectors.toList())
                    )
                    .build();
            })
            .collect(Collectors.toList());
    }
}
