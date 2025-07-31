package com.Ironman.back.repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.Ironman.back.entity.RoutineEntity;

public interface RoutineRepository extends JpaRepository<RoutineEntity, Long> {
    List<RoutineEntity> findByEmail(String email); // 이메일 기준 조회

 // RoutineRepository.java
    @Query(value = """
        SELECT SUM(e.exercise_time)
        FROM routine_exercise e
        WHERE e.routine_id = :routineId
        """, nativeQuery = true)
    Integer getTotalDurationByRoutineId(@Param("routineId") Long routineId);

    
}
