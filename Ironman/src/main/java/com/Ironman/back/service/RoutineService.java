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
import com.Ironman.back.entity.UserEntity;
import com.Ironman.back.repo.RoutineRepository;
import com.Ironman.back.repo.ExerciseRepository;
import com.Ironman.back.repo.RoutineExerciseRepository;
import com.Ironman.back.repo.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoutineService {

    private final RoutineRepository routineRepository;
    private final RoutineExerciseRepository routineExerciseRepository;
    private final ExerciseRepository exerciseRepository;
    
    @Transactional
    public void saveFullRoutine(FullRoutineDto dto, String email) {

        // 1. 루틴 저장
        RoutineEntity routine = RoutineEntity.builder()
                .email(email)  //  필드명 정확히 맞춰야 함
                .title(dto.getTitle())
                .summary(dto.getSummary())
                .build();

        routineRepository.save(routine);

        // 2. 운동 목록 저장
     // 2. 운동 목록 저장 (ExerciseEntity 참조)
        List<RoutineExerciseEntity> exercises = dto.getExercises().stream()
        		.map(exDto -> {
        		    if (exDto.getExerciseId() == null) {
        		        throw new IllegalArgumentException("운동 ID가 null입니다. 클라이언트에서 exerciseId를 포함하여 전송해야 합니다.");
        		    }

        		    ExerciseEntity exercise = exerciseRepository.findById(exDto.getExerciseId())
        		        .orElseThrow(() -> new IllegalArgumentException("운동 ID가 잘못되었습니다: " + exDto.getExerciseId()));

        		    return RoutineExerciseEntity.builder()
        		        .routine(routine)
        		        .exercise(exercise)
        		        .sets(exDto.getSets())
        		        .reps(exDto.getReps())
        		        .exerciseTime(exDto.getExerciseTime())
        		        .order(exDto.getOrder())
        		        .build();
        		})

                .collect(Collectors.toList());


        routineExerciseRepository.saveAll(exercises);
    }
    
    @Transactional
	public void deleteRoutine(Long routineId, String userEmail) {
	    RoutineEntity routine = routineRepository.findById(routineId)
	        .orElseThrow(() -> new RuntimeException("루틴이 존재하지 않습니다."));

	    if (!routine.getEmail().equals(userEmail)) {
	        throw new RuntimeException("본인의 루틴만 삭제할 수 있습니다.");
	    }

	    // 해당 루틴에 연결된 운동들 먼저 삭제
	    routineExerciseRepository.deleteByRoutine(routine);

	    // 루틴 삭제
	    routineRepository.delete(routine);
	}
    
    @Transactional(readOnly = true)
    public List<FullRoutineDto> getRoutinesByUser(String email) {
        List<RoutineEntity> routines = routineRepository.findByEmail(email);

        return routines.stream()
            .map(routine -> {
                List<RoutineExerciseEntity> exercises = routineExerciseRepository.findByRoutine(routine);

                // 🔹 exerciseTime 합산
                int totalExerciseTime = exercises.stream()
                    .mapToInt(e -> e.getExerciseTime() != null ? e.getExerciseTime() : 0)
                    .sum();

                return FullRoutineDto.builder()
                    .routineId(routine.getRoutineId())
                    .title(routine.getTitle())
                    .summary(routine.getSummary())
                    .email(routine.getEmail())
                    .exerciseTime(totalExerciseTime)  // 🔹 여기서도 duration이 아니라 exerciseTime으로
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
