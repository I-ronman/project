package com.Ironman.back.repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.Ironman.back.entity.RoutineEntity;

public interface RoutineRepository extends JpaRepository<RoutineEntity, Long> {
    List<RoutineEntity> findByEmail(String email); // 이메일 기준 조회
}
