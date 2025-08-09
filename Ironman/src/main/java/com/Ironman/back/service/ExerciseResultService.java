package com.Ironman.back.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.Ironman.back.dto.ExerciseLogDto;
import com.Ironman.back.entity.SingleExerciseLogEntity;
import com.Ironman.back.repo.SingleExerciseLogRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExerciseResultService {

	    private final SingleExerciseLogRepository singleExerciseLogRepository;

	    @Transactional
	    public List<Long> saveLogs(ExerciseLogDto dto) {
	        List<Long> savedLogIds = new ArrayList<>();

	        for (ExerciseLogDto.ExerciseEntity entry : dto.getExerciseLogs()) {
	            SingleExerciseLogEntity log = new SingleExerciseLogEntity();
	            log.setEmail(dto.getEmail());
	            log.setExerciseId(entry.getExerciseId());
	            log.setDuration(entry.getDuration());
	            log.setEndTime(entry.getEndTime());
	            log.setGoodCount(entry.getGoodCount());
	            log.setBadCount(entry.getBadCount());

	            // 저장 후 ID 저장
	            SingleExerciseLogEntity saved = singleExerciseLogRepository.save(log);
	            savedLogIds.add(saved.getSingleExerciseLogId()); // ✅ 여기!
	        }

	        return savedLogIds;
	    }
	}
