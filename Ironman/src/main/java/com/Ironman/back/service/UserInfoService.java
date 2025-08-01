package com.Ironman.back.service;

import org.springframework.stereotype.Service;

import com.Ironman.back.dto.UserInfoDto;
import com.Ironman.back.entity.UserInfoEntity;
import com.Ironman.back.repo.UserInfoRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserInfoService {
	
	private final UserInfoRepository userInfoRepository;
	
	@Transactional
	public void saveUserInfo(UserInfoDto dto, String email) {
		UserInfoEntity entity = dto.toEntity(email);
		userInfoRepository.save(entity);
	}
}
