package com.Ironman.back.repo;

import com.Ironman.back.entity.SingleExerciseLogEntity;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SingleExerciseLogRepository extends JpaRepository<SingleExerciseLogEntity, Long> {
	Optional<SingleExerciseLogEntity> findTopByEmailOrderBySingleExerciseLogIdDesc(String email);
}
