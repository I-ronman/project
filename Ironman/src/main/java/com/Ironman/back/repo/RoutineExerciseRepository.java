package com.Ironman.back.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Ironman.back.entity.RoutineEntity;
import com.Ironman.back.entity.RoutineExerciseEntity;

@Repository
public interface RoutineExerciseRepository extends JpaRepository<RoutineExerciseEntity, Long> {

    List<RoutineExerciseEntity> findByRoutine(RoutineEntity routine);
}
