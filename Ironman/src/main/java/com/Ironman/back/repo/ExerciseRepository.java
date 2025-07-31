package com.Ironman.back.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Ironman.back.entity.ExerciseEntity;

public interface ExerciseRepository extends JpaRepository<ExerciseEntity, Long> {
    // 운동 이름으로 검색하고 싶을 때
    ExerciseEntity findByExerciseName(String exerciseName);
}
