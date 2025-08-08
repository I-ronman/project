package com.Ironman.back.service;

import org.springframework.stereotype.Service;

import com.Ironman.back.entity.UserEntity;
import com.Ironman.back.repo.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {
	private final UserRepository userRepository;
	
	@Transactional
	public void updateFace(String email, String face) {
		UserEntity user = userRepository.findById(email)
				.orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
		user.setFace(face);
	}
}
