package com.Ironman.back.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.Ironman.back.dto.SurveyDto;
import com.Ironman.back.entity.UserInfoEntity;
import com.Ironman.back.repo.UserInfoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserInfoService {

    private final UserInfoRepository userInfoRepository;

    public void saveSurvey(String email, SurveyDto dto) {
        UserInfoEntity userInfo = userInfoRepository.findByEmail(email)
            .orElse(UserInfoEntity.builder().email(email).build());

        if (dto.getHeight() != null) userInfo.setHeight(dto.getHeight());
        if (dto.getWeight() != null) userInfo.setWeight(dto.getWeight());
        if (dto.getGoalWeight() != null) userInfo.setGoalWeight(dto.getGoalWeight());
        if (dto.getPushUp() != null) userInfo.setPushUp(dto.getPushUp());
        if (dto.getPlank() != null) userInfo.setPlank(dto.getPlank());
        if (dto.getSquat() != null) userInfo.setSquat(dto.getSquat());
        if (dto.getPliability() != null) userInfo.setPliability(dto.getPliability());
        if (dto.getWorkoutFrequency() != null) userInfo.setWorkoutFrequency(dto.getWorkoutFrequency());
        if (dto.getActivityLevel() != null) userInfo.setActivityLevel(dto.getActivityLevel());
        userInfoRepository.save(userInfo);
    }
    
 // UserInfoService.java
    public boolean hasSurvey(String email) {
        return userInfoRepository.existsByEmail(email); // ✅ 존재만 보면 됨
    }

    public Optional<SurveyDto> findSurveyByEmail(String email) {
        return userInfoRepository.findByEmail(email)
                .map(entity -> {
                    SurveyDto dto = new SurveyDto();
                    dto.setHeight(entity.getHeight());
                    dto.setWeight(entity.getWeight());
                    dto.setGoalWeight(entity.getGoalWeight());
                    dto.setPushUp(entity.getPushUp());
                    dto.setPlank(entity.getPlank());
                    dto.setSquat(entity.getSquat());
                    dto.setPliability(entity.getPliability());
                    dto.setWorkoutFrequency(entity.getWorkoutFrequency());
                    dto.setActivityLevel(entity.getActivityLevel());
                    return dto;
                });
    }

    
    
}

