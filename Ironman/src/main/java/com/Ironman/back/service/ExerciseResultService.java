package com.Ironman.back.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.Ironman.back.dto.ExerciseLogDto;
import com.Ironman.back.entity.SingleExerciseLogEntity;
import com.Ironman.back.entity.UserEntity;
import com.Ironman.back.repo.SingleExerciseLogRepository;
import com.Ironman.back.repo.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExerciseResultService {

	    private final SingleExerciseLogRepository singleExerciseLogRepository;
	    private final UserRepository userRepository;
	    
	    @Transactional
	    public List<Long> saveLogs(ExerciseLogDto dto) {
	        UserEntity user = userRepository.findByEmail(dto.getEmail())
	                .orElseThrow(() -> new IllegalArgumentException("User not found: " + dto.getEmail()));

	        List<Long> logIds = new ArrayList<>();
	        for (ExerciseLogDto.ExerciseEntity ex : dto.getExerciseLogs()) {
	            SingleExerciseLogEntity log = new SingleExerciseLogEntity();
	            log.setEmail(user.getEmail()); // 우리 프로젝트는 email만 저장
	            log.setExerciseId(ex.getExerciseId());
	            log.setDuration(ex.getDuration());
	            log.setEndTime(ex.getEndTime());
	            log.setGoodCount(ex.getGoodCount());
	            log.setBadCount(ex.getBadCount());

	            logIds.add(singleExerciseLogRepository.save(log).getSingleExerciseLogId());
	        }
	        return logIds;
	    }  
	}