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

 // ===== 내부 유틸: exerciseId 없으면 name으로 조회 =====
    private Long resolveExerciseId(RoutineExerciseDto exDto) {
        if (exDto.getExerciseId() != null) {
            return exDto.getExerciseId();
        }
        String name = exDto.getName();
        if (name != null && !name.isBlank()) {
            ExerciseEntity found = exerciseRepository.findByExerciseName(name);
            if (found == null) {
                throw new IllegalArgumentException("운동 이름을 인식할 수 없습니다: " + name);
            }
            return found.getExerciseId();
        }
        throw new IllegalArgumentException("운동 ID/이름이 모두 없습니다.");
    }

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
            routineRepository.save(routine);

            // 기존 운동 목록 삭제 후 재등록
            routineExerciseRepository.deleteByRoutine(routine);

        } else {
            // 2. 신규 저장
            routine = RoutineEntity.builder()
                .email(email)
                .title(dto.getTitle())
                .summary(dto.getSummary())
                .build();
            routineRepository.save(routine);
        }

        // 3. 운동 항목 재등록 (공통)
        List<RoutineExerciseEntity> exerciseEntities = dto.getExercises().stream()
            .map(exDto -> {
                // ★ ID 해석 (없으면 name으로 찾아서 보정)
                Long exId = resolveExerciseId(exDto);

                ExerciseEntity exercise = exerciseRepository.findById(exId)
                    .orElseThrow(() ->
                        new IllegalArgumentException("유효하지 않은 운동 ID: " + exId));

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
                        int time = e.getExerciseTime() != null ? e.getExerciseTime() : 1;
                        int breakTime = e.getBreaktime() != null ? e.getBreaktime() : 0;

                        int exerciseDuration = sets * time;
                        int totalBreakTime = (sets > 1) ? (sets - 1) * breakTime : 0;

                        return exerciseDuration + totalBreakTime;
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
