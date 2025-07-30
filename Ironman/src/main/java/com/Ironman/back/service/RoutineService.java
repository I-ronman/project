package com.Ironman.back.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Ironman.back.dto.FullRoutineDto;
import com.Ironman.back.dto.ExerciseDto;
import com.Ironman.back.entity.RoutineEntity;
import com.Ironman.back.entity.RoutineExerciseEntity;
import com.Ironman.back.entity.UserEntity;
import com.Ironman.back.repo.RoutineRepository;
import com.Ironman.back.repo.RoutineExerciseRepository;
import com.Ironman.back.repo.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoutineService {

    private final RoutineRepository routineRepository;
    private final RoutineExerciseRepository exerciseRepository;
    private final UserRepository userRepository;

    @Transactional
    public void saveFullRoutine(FullRoutineDto dto, String email) {
        // 1. 사용자 찾기
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. 루틴 저장
        RoutineEntity routine = RoutineEntity.builder()
                .email(email)  //  필드명 정확히 맞춰야 함
                .title(dto.getTitle())
                .summary(dto.getSummary())
                .build();

        routineRepository.save(routine);

        // 3. 운동 목록 저장
        List<RoutineExerciseEntity> exercises = dto.getExercises().stream()
        	    .map(exDto -> RoutineExerciseEntity.builder()
        	            .routine(routine)
        	            .sets(exDto.getSets())
        	            .reps(exDto.getReps())
        	            .exerciseTime(exDto.getExerciseTime())
        	            .order(exDto.getOrder())
        	            .build())
        	    .collect(Collectors.toList());


        exerciseRepository.saveAll(exercises);
    }
    
    
    
}
