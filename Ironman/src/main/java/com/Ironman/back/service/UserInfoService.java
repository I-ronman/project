package com.Ironman.back.service;

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

        userInfo.setHeight(dto.getHeight());
        userInfo.setWeight(dto.getWeight());
        userInfo.setActivityLevel(dto.getActivityLevel());
        userInfo.setPushUp(dto.getPushUp());
        userInfo.setPlank(dto.getPlank());
        userInfo.setSquat(dto.getSquat());
        userInfo.setPliability(dto.getPliability());

        userInfoRepository.save(userInfo);
    }
}

