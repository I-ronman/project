package com.Ironman.back.repo;

import com.Ironman.back.entity.SingleExerciseLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SingleExerciseLogRepository extends JpaRepository<SingleExerciseLogEntity, Long> {
    // 필요 시 사용자 email로 조회 등 추가
}
