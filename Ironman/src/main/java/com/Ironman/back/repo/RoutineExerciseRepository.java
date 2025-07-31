package com.Ironman.back.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Ironman.back.entity.RoutineEntity;
import com.Ironman.back.entity.RoutineExerciseEntity;

import jakarta.transaction.Transactional;

@Repository
public interface RoutineExerciseRepository extends JpaRepository<RoutineExerciseEntity, Long> {

    List<RoutineExerciseEntity> findByRoutine(RoutineEntity routine);

    @Modifying
    @Transactional
    @Query("DELETE FROM RoutineExerciseEntity e WHERE e.routine = :routine")
    void deleteByRoutine(@Param("routine") RoutineEntity routine);
    
    
    
}
